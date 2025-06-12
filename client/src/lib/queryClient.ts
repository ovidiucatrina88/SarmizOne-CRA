import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Get the response text
    const text = (await res.text()) || res.statusText;
    
    // Try to parse as JSON if it looks like JSON
    let errorMessage = text;
    if (text.startsWith('{') && text.endsWith('}')) {
      try {
        const jsonError = JSON.parse(text);
        errorMessage = jsonError.message || jsonError.error || text;
      } catch (e) {
        // If parsing fails, just use the text as is
        console.error("Failed to parse error as JSON:", e);
      }
    } else if (text.includes('<!DOCTYPE html>')) {
      // If it's HTML, extract a simpler error message
      errorMessage = "Server error. Please try again.";
    }
    
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Pre-process the data to ensure all numeric values are properly converted
  if (data && typeof data === 'object') {
    // Store the original itemType to preserve it
    const origItemType = data['itemType'];
    
    data = JSON.parse(JSON.stringify(data, (key, value) => {
      // Convert stringified numbers to actual numbers
      // But preserve certain fields as strings and don't convert empty strings
      if (typeof value === 'string' && value !== '' && !isNaN(Number(value)) && 
          key !== 'riskId' && key !== 'assetId' && key !== 'itemType' && 
          key !== 'entityId' && key !== 'description' && key !== 'parentEntityId') {
        return Number(value);
      }
      return value;
    }));
    
    // Restore the original itemType if it was changed
    if (origItemType) {
      data['itemType'] = origItemType;
    }
    
    console.log(`API Request to ${url} with data:`, data);
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 0, // Changed from Infinity to 0 to ensure data is always considered stale and will refetch
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
