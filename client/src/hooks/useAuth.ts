import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';

export interface User {
  id: number;
  username?: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  authType: 'local' | 'sso';
  profileImageUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation('/login');
    },
  });

  const isAuthenticated = !!user && !error;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    error,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
  };
}