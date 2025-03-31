import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useCookies } from '@/contexts/CookieContext';
import { getNewToken } from '@/lib/action';
import { authService } from '@/services/authService';
import logError from '@/utils';

export const useRefresh = () => {
  const router = useRouter();
  const { cookie } = useCookies();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to check if token is expired
  // You can implement JWT decoding here if your tokens include expiry claims
  const isTokenExpired = useCallback((token: string) => {
    if (!token) return true;

    try {
      // Basic JWT structure check (this is a simplified check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }, []);

  // Function to refresh token
  const refreshToken = useCallback(async () => {
    if (isRefreshing) return null;

    try {
      setIsRefreshing(true);

      const newToken = await getNewToken();

      if (newToken !== cookie) {
        return newToken;
      }

      await authService.refresh();
      const refreshedToken = await getNewToken();

      return refreshedToken;
    } catch (error) {
      logError(error);
      router.push('/login');
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  return {
    isTokenExpired: () => isTokenExpired(cookie),
    refreshToken,
    isRefreshing,
  };
};
