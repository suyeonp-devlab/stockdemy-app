import { request } from "@/shared/lib/axios";
import { SendCodeRequest, VerifyCodeRequest, ResetPasswordRequest } from "@/features/auth/auth.type";

// 인증코드 발송
export const sendPasswordResetCode = async (data: SendCodeRequest) => {
  await request<void>({ method: "POST", url: "/api/auth/password/code/send", data });
}

// 인증코드 검증
export const verifyPasswordResetCode = async (data: VerifyCodeRequest) => {
  await request<void>({ method: "POST", url: "/api/auth/password/code/verify", data });
}

// 비밀번호 재설정
export const resetPassword = async (data: ResetPasswordRequest) => {
  await request<void>({ method: "POST", url: "/api/auth/password/reset", data });
}
