import { request } from "@/shared/lib/axios";
import {
  SignupRequest,
  GoogleSignupRequest,
  SendCodeRequest,
  VerifyCodeRequest,
  AuthTokenResponse
} from "@/features/auth/auth.type";

// 인증코드 발송
export const sendCode = (data: SendCodeRequest) =>
  request<void>({ method: "POST", url: "/api/auth/code/send", data });

// 인증코드 확인
export const verifyCode = (data: VerifyCodeRequest) =>
  request<void>({ method: "POST", url: "/api/auth/code/verify", data });

// 회원가입
export const signup = (data: SignupRequest) =>
  request<AuthTokenResponse>({ method: "POST", url: "/api/auth/signup", data });

// 구글 회원가입
export const googleSignup = (data: GoogleSignupRequest) =>
  request<AuthTokenResponse>({ method: "POST", url: "/api/auth/google", data });
