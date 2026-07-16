import { request, requestRequired } from "@/shared/lib/axios";
import {
  SignupRequest,
  SendCodeRequest,
  VerifyCodeRequest,
  AuthTokenResponse,
  GoogleAuthRequest
} from "@/features/auth/auth.type";

// 인증코드 발송
export const sendSignupCode = async (data: SendCodeRequest) => {
  await request<void>({ method: "POST", url: "/api/auth/signup/code/send", data });
}

// 인증코드 검증
export const verifySignupCode = async (data: VerifyCodeRequest) => {
  await request<void>({ method: "POST", url: "/api/auth/signup/code/verify", data });
}

// 회원가입
export const signup = async (data: SignupRequest) => {
  return requestRequired<AuthTokenResponse>({ method: "POST", url: "/api/auth/signup", data });
}

// 구글 회원가입
export const googleSignup = async (data: GoogleAuthRequest) => {
  return requestRequired<AuthTokenResponse>({ method: "POST", url: "/api/auth/signup/google", data });
}