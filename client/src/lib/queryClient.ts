import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  arg1: string,
  arg2?: string | RequestInit,
  arg3?: any
): Promise<any> {
  let url: string;
  let init: RequestInit;

  const isMethod = ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(arg1.toUpperCase());

  if (isMethod && typeof arg2 === "string") {
    // Signature: apiRequest(method, url, data)
    url = arg2;
    init = {
      method: arg1.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
      body: arg3 !== undefined ? JSON.stringify(arg3) : undefined,
    };
  } else {
    // Signature: apiRequest(url, options)
    url = arg1;
    init = (arg2 as RequestInit) || {};
    init.headers = {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    };
  }

  const res = await fetch(url, {
    ...init,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  
  // Try to parse JSON response, if not possible, return the response object
  try {
    const data = await res.json();
    if (data && typeof data === "object") {
      Object.defineProperty(data, "json", {
        value: async () => data,
        enumerable: false,
        configurable: true,
      });
    }
    return data;
  } catch (e) {
    return res;
  }
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
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
