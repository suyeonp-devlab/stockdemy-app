import { request, requestRequired } from "@/shared/lib/axios";
import { MeResponse } from "@/features/auth/auth.type";

// 내 정보 조회 (refreshToken으로 accessToken 재발급)
export const getMe = () =>
  requestRequired<MeResponse>({ method: "GET", url: "/api/users/me", meta: {
    skipErrorAlert: true
  }});

// 로그아웃
export const logout = () =>
  request<void>({ method: "POST", url: "/api/auth/logout" });
