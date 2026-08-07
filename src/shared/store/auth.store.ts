import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
  sessionExpired: boolean;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

// (로그인) 인증 상태
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  sessionExpired: false,
  setAccessToken: (token) => set({ accessToken: token, isLoggedIn: !!token, sessionExpired: false }),
  logout: () => set({ accessToken: null, isLoggedIn: false, sessionExpired: true }),
}));
