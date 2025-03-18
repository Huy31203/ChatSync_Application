import { toast } from 'react-toastify';
import { create } from 'zustand';

import { authService } from '@/services/auth-service';
import { IProfile } from '@/types/profile';
import { logError } from '@/utils';

interface AuthState {
  profile: IProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setProfile: (profile: IProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: true,
  error: null,
  login: async (email: string, password: string) => {
    try {
      set({ loading: true });

      await authService.login({ email, password });

      const res = await authService.getCurrentProfile();
      const profile = res.result;

      set({ profile, loading: false });

      toast.success('Login successfully');
    } catch (error) {
      logError(error);
      set({
        loading: false,
      });
    }
  },
  logout: () => {
    authService.logout();
    toast.success('Logout successfully');

    set({ profile: null });
  },
  setProfile: (profile: IProfile | null) => set({ profile }),
  setLoading: (loading: boolean) => set({ loading }),
}));
