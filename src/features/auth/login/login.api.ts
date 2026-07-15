import { requestRequired } from "@/shared/lib/axios";
import { LoginRequest, AuthTokenResponse, GoogleAuthRequest } from "@/features/auth/auth.type";

// 로그인
export const login = async (data: LoginRequest) => {
  return requestRequired<AuthTokenResponse>({ method: "POST", url: "/api/auth/login", data });
}

// 구글 로그인
export const googleLogin = async (data: GoogleAuthRequest) => {
  return requestRequired<AuthTokenResponse>({ method: "POST", url: "/api/auth/google", data });
}