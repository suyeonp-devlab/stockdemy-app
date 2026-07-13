import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

// (로그인) 인증 상태
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  setAccessToken: (token) => set({ accessToken: token, isLoggedIn: !!token }),
  logout: () => set({ accessToken: null, isLoggedIn: false }),
}));
