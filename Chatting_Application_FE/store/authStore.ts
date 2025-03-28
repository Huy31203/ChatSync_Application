import { toast } from 'react-toastify';
import { create } from 'zustand';

import { authService } from '@/services/authService';
import { IProfile } from '@/types/profile';
import logError from '@/utils';

interface AuthState {
  profile: IProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setProfile: (profile: IProfile | null) => void;
  renewProfile: () => Promise<void>;
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
      set({ loading: false });
    }
  },
  logout: () => {
    set({ loading: true });

    authService.logout();
    toast.success('Logout successfully');

    set({ profile: null });

    set({ loading: false });
  },
  setProfile: (profile: IProfile | null) => set({ profile }),
  renewProfile: async () => {
    try {
      const res = await authService.getCurrentProfile();
      const profile = res.result;

      set({ profile });
    } catch (error) {
      logError(error);
    }
  },
  setLoading: (loading: boolean) => set({ loading }),
}));
