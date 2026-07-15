import { request, requestRequired } from "@/shared/lib/axios";
import { MeResponse } from "@/features/auth/auth.type";

// 내 정보 조회
export const getMe = async () => {
  return requestRequired<MeResponse>({ method: "GET", url: "/api/users/me", meta: { skipErrorAlert: true }});
};

// 로그아웃
export const logout = async () => {
  await request<void>({ method: "POST", url: "/api/auth/logout" });
};