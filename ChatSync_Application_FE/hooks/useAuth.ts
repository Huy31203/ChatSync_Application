import { useEffect } from 'react';

import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import logError from '@/utils';

export function useAuth() {
  const { profile, setProfile, renewProfile, loading, login, logout, setLoading } = useAuthStore();

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

    loadUser();
  }, [setLoading, setProfile]);

  return { profile, renewProfile, loading, login, logout };
}
