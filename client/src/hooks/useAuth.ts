import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!token,
    retry: false,
    onError: async (error) => {
      if (error.response?.status === 401 && !isRefreshing) {
        setIsRefreshing(true);
        try {
          const response = await fetch('/api/auth/refresh', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const { token: newToken } = await response.json();
            localStorage.setItem('authToken', newToken);
            setToken(newToken);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        } finally {
          setIsRefreshing(false);
        }
      }
    },
    queryFn: async (): Promise<User> => {
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return response.json();
    },
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('authToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    window.location.reload();
  };

  return {
    user,
    isLoading: isLoading && !!token,
    isAuthenticated: !!user && !!token,
    token,
    logout,
    error,
  };
}