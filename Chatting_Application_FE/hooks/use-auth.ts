import { useEffect } from 'react';

import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { logError } from '@/utils';

export function useAuth() {
  const { profile, setProfile, loading, login, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authService.getCurrentProfile();
        setProfile(res.result);
      } catch (error) {
        logError(error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [setLoading, setProfile]);

  return { profile, loading, login, logout };
}
