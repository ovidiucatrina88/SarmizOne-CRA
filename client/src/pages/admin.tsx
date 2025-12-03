import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Database, RefreshCw, Settings, Shield, User, Users, Key, Globe, UserPlus, ShieldCheck, UserX, Calendar, Eye, EyeOff, Trash2 } from "lucide-react";
import Layout from "@/components/layout/layout";
import { GlowCard } from "@/components/ui/glow-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { z } from "zod";

// User interfaces and schemas
interface User {
  id: number;
  username?: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  authType: 'local' | 'sso';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

// Utility function for date formatting
const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateUserData = z.infer<typeof createUserSchema>;

// Create User Dialog Component
function CreateUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "user"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const response = await fetch('/api/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "New user account has been created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/auth/users"] });
      setIsOpen(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        role: "user"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Create User",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateUser = () => {
    try {
      const validatedData = createUserSchema.parse(newUser);
      createUserMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new local user account with username and password authentication.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={newUser.firstName}
                onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={newUser.lastName}
                onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={newUser.username}
              onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
              placeholder="johndoe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              placeholder="john.doe@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter secure password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={newUser.role} onValueChange={(value: 'user' | 'admin') => setNewUser(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User (Read-only)</SelectItem>
                <SelectItem value="admin">Admin (Read-write)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateUser}
            disabled={createUserMutation.isPending}
          >
            {createUserMutation.isPending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// User Table Component
function UserTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<{ success: boolean; users: User[] }>({
    queryKey: ["/api/auth/users"],
    retry: false,
    staleTime: 0, // Always consider data stale
    cacheTime: 0, // Don't cache responses
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: 'user' | 'admin' }) => {
      const response = await fetch(`/api/auth/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update role');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/auth/users"] });
      queryClient.refetchQueries({ queryKey: ["/api/auth/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/auth/users/${userId}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to deactivate user');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Deactivated",
        description: "User account has been deactivated",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/auth/users"] });
      queryClient.refetchQueries({ queryKey: ["/api/auth/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Deactivate User",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Deleted",
        description: "User has been permanently deleted",
      });

      // Force cache invalidation and refetch
      queryClient.invalidateQueries({ queryKey: ["/api/auth/users"] });
      queryClient.refetchQueries({ queryKey: ["/api/auth/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Delete User",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getRoleBadgeVariant = (role: string) => {
    return role === 'admin' ? 'destructive' : 'secondary';
  };

  const getAuthTypeBadgeVariant = (authType: string) => {
    return authType === 'local' ? 'default' : 'outline';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!users?.users || users.users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <GlowCard className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">User directory</p>
          <h3 className="text-lg font-semibold text-white">Accounts</h3>
        </div>
        <div className="text-sm text-white/70">{users.users.length} users</div>
      </div>
      <div className="overflow-hidden rounded-[28px] border border-white/10">
        <div className="bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white/50">
          Users
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="text-xs uppercase tracking-wide text-white/50">
              <TableRow className="border-b border-white/5">
                <TableHead>User</TableHead>
                <TableHead>Authentication</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.users.map((user) => (
                <TableRow key={user.id} className="border-b border-white/5">
                  <TableCell>
                    <div>
                      <div className="font-semibold text-white">{user.displayName}</div>
                      <div className="text-sm text-white/70">{user.email}</div>
                      {user.username && (
                        <div className="text-xs text-white/60">@{user.username}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="rounded-full border border-white/10 bg-white/5 text-xs text-white/80">
                      {user.authType === 'local' ? 'Local' : 'SSO'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="rounded-full border border-white/10 bg-white/5 text-xs text-white/80">
                      {user.role === 'admin' ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          User
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`rounded-full border px-3 py-0.5 text-xs ${user.isActive ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100' : 'border-white/10 bg-white/5 text-white/70'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <div className="flex items-center gap-1 text-sm text-white/80">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.lastLogin)}
                      </div>
                    ) : (
                      <span className="text-white/60 text-sm">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      <Calendar className="h-3 w-3" />
                      {formatDate(user.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(role: 'user' | 'admin') =>
                          updateRoleMutation.mutate({ userId: user.id, role })
                        }
                      >
                        <SelectTrigger className="w-[120px] border-white/10 bg-white/5 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      {user.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                          onClick={() => deactivateUserMutation.mutate(user.id)}
                          disabled={deactivateUserMutation.isPending}
                          title="Deactivate user"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => deleteUserMutation.mutate(user.id)}
                        disabled={deleteUserMutation.isPending}
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </GlowCard>
  );

}



export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  // Fetch users, logs, database stats, etc.
  const { data: logs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ['/api/logs'],
  });

  // Format the logs for display
  const formattedLogs = Array.isArray(logs?.data) ? logs.data :
    (logs && typeof logs === 'object' && Array.isArray(logs)) ? logs : [];

  return (
    <Layout>
      <div className="container space-y-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              System administration and monitoring
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 lg:w-[500px]">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Database className="h-4 w-4" /> Activity Logs
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="sso" className="flex items-center gap-2">
              <Key className="h-4 w-4" /> SSO
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="bg-gray-800 rounded-lg border border-gray-600">
              <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">User Management</h3>
                    <p className="text-sm text-gray-300 mt-1">
                      Create and manage user accounts with role-based access control
                    </p>
                  </div>
                  <CreateUserDialog />
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-b-lg">
                <UserTable />
              </div>
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <div className="bg-gray-800 rounded-lg border border-gray-600">
              <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
                <h3 className="text-lg font-semibold text-white">Activity Logs</h3>
                <p className="text-sm text-gray-300 mt-1">System activity and user action logs</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-b-lg">
                {isLoadingLogs ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : formattedLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formattedLogs.map((log: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(log.createdAt || log.timestamp)}
                          </TableCell>
                          <TableCell>
                            {log.event || log.action}
                          </TableCell>
                          <TableCell>
                            {log.username || log.user || 'System'}
                          </TableCell>
                          <TableCell className="max-w-sm truncate">
                            {log.details}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No logs available
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Configure authentication, authorization, and other security settings for the application.
                </p>

                <div className="space-y-6">
                  <div className="grid gap-2">
                    <h3 className="font-medium">Authentication Method</h3>
                    <p className="text-sm text-muted-foreground">
                      Currently using: <span className="font-medium">Local Authentication</span>
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="font-medium">Session Timeout</h3>
                    <p className="text-sm text-muted-foreground">
                      Current setting: <span className="font-medium">30 minutes</span>
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="font-medium">Password Policy</h3>
                    <p className="text-sm text-muted-foreground">
                      Current setting: <span className="font-medium">Standard</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SSO Tab */}
          <TabsContent value="sso" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Single Sign-On Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-md bg-blue-50 p-4 mb-6">
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">
                          Okta OIDC Integration
                        </h3>
                        <div className="mt-1 text-sm text-blue-700">
                          <p>
                            Configure OpenID Connect (OIDC) integration with Okta for secure authentication.
                            You'll need to create an OIDC app in your Okta admin portal first.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-6">
                    {/* Integration Status */}
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <h3 className="font-medium">Integration Status</h3>
                        <p className="text-sm text-muted-foreground">SSO Integration is inactive</p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                        <span className="text-sm">Disabled</span>
                      </div>
                    </div>

                    {/* Okta Domain */}
                    <div className="grid gap-2">
                      <label htmlFor="oktaDomain" className="text-sm font-medium">
                        Okta Domain URL
                      </label>
                      <div className="flex">
                        <input
                          id="oktaDomain"
                          type="text"
                          placeholder="https://your-domain.okta.com"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The base URL of your Okta organization
                      </p>
                    </div>

                    {/* Client ID */}
                    <div className="grid gap-2">
                      <label htmlFor="clientId" className="text-sm font-medium">
                        Client ID
                      </label>
                      <div className="flex">
                        <input
                          id="clientId"
                          type="text"
                          placeholder="0oa1c5xxxxxxxxxxx"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The client ID of your Okta application
                      </p>
                    </div>

                    {/* Client Secret */}
                    <div className="grid gap-2">
                      <label htmlFor="clientSecret" className="text-sm font-medium">
                        Client Secret
                      </label>
                      <div className="flex">
                        <input
                          id="clientSecret"
                          type="password"
                          placeholder="••••••••••••••••"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The client secret of your Okta application
                      </p>
                    </div>

                    {/* Redirect URI */}
                    <div className="grid gap-2">
                      <label htmlFor="redirectUri" className="text-sm font-medium">
                        Redirect URI
                      </label>
                      <div className="flex">
                        <input
                          id="redirectUri"
                          type="text"
                          placeholder="https://your-app.com/auth/callback"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The URI to redirect to after authentication (must match Okta configuration)
                      </p>
                    </div>

                    {/* Scopes */}
                    <div className="grid gap-2">
                      <label htmlFor="scopes" className="text-sm font-medium">
                        Scopes
                      </label>
                      <div className="flex">
                        <input
                          id="scopes"
                          type="text"
                          placeholder="openid profile email"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Space-separated scopes to request from Okta
                      </p>
                    </div>

                    {/* Authorization Server */}
                    <div className="grid gap-2">
                      <label htmlFor="authServer" className="text-sm font-medium">
                        Authorization Server ID
                      </label>
                      <div className="flex">
                        <input
                          id="authServer"
                          type="text"
                          placeholder="default"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The Okta authorization server ID (use "default" for the default server)
                      </p>
                    </div>

                    {/* User Profile Group Attribute */}
                    <div className="grid gap-2">
                      <label htmlFor="groupAttribute" className="text-sm font-medium">
                        Group Attribute Name
                      </label>
                      <div className="flex">
                        <input
                          id="groupAttribute"
                          type="text"
                          placeholder="groups"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The name of the attribute that contains group memberships
                      </p>
                    </div>

                    {/* Response Type */}
                    <div className="grid gap-2">
                      <label htmlFor="responseType" className="text-sm font-medium">
                        Response Type
                      </label>
                      <div className="flex">
                        <select
                          id="responseType"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="code">Authorization Code</option>
                          <option value="implicit">Implicit</option>
                          <option value="code id_token">Authorization Code with ID Token</option>
                        </select>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The OIDC flow type to use for authentication
                      </p>
                    </div>

                    {/* Group Role Mapping */}
                    <div className="grid gap-2">
                      <h3 className="text-sm font-medium">Group to Role Mapping</h3>
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="adminGroup" className="text-xs font-medium">
                              Admin Group (read-write)
                            </label>
                            <input
                              id="adminGroup"
                              type="text"
                              placeholder="GRC-Admins"
                              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Members have full read-write access to all features
                            </p>
                          </div>
                          <div>
                            <label htmlFor="userGroup" className="text-xs font-medium">
                              User Group (read-only)
                            </label>
                            <input
                              id="userGroup"
                              type="text"
                              placeholder="GRC-Users"
                              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Members have read-only access to all features
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Map Okta groups to application roles
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                      <Button type="button">
                        Save Configuration
                      </Button>
                      <Button type="button" variant="secondary">
                        Test Connection
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Configure global system settings for the application.
                </p>

                <div className="space-y-6">
                  <div className="grid gap-2">
                    <h3 className="font-medium">Database Connection</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="font-medium text-green-600">Connected</span>
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="font-medium">Data Backup</h3>
                    <p className="text-sm text-muted-foreground">
                      Last backup: <span className="font-medium">Never</span>
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="font-medium">System Version</h3>
                    <p className="text-sm text-muted-foreground">
                      Current version: <span className="font-medium">1.0.0</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
