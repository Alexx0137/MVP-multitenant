import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  tenantId: string | null;
  tenantName: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, token: string, tenantId: string, tenantName?: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=86400`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tenantId: null,
      tenantName: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user, token, tenantId, tenantName = 'Global') => {
        localStorage.setItem('token', token);
        localStorage.setItem('tenantId', tenantId);
        setCookie('token', token);
        set({ user, token, tenantId, tenantName, isAuthenticated: true });
      },

      logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('tenantId');
      deleteCookie('token');
      
      if (typeof window !== 'undefined') {
        const queryClient = (window as any).__queryClient;
        if (queryClient) {
          queryClient.clear();
        }
      }
      
      set({ user: null, token: null, tenantId: null, tenantName: null, isAuthenticated: false });
    },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);