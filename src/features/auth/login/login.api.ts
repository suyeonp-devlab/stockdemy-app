import { request } from "@/shared/lib/axios";
import {
  LoginRequest,
  GoogleSignupRequest,
  AuthTokenResponse
} from "@/features/auth/auth.type";

// 로그인
export const login = (data: LoginRequest) =>
  request<AuthTokenResponse>({ method: "POST", url: "/api/auth/login", data });

// 구글 로그인
export const googleLogin = (data: GoogleSignupRequest) =>
  request<AuthTokenResponse>({ method: "POST", url: "/api/auth/google", data });
