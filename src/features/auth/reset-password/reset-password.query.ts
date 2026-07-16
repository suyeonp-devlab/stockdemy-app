import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { sendPasswordResetCode, verifyPasswordResetCode, resetPassword } from "@/features/auth/reset-password/reset-password.api";

// 인증코드 발송 mutation
export const useSendPasswordResetCodeMutation = () => {
  return useAppMutation({ mutationFn: sendPasswordResetCode });
};

// 인증코드 검증 mutation
export const useVerifyPasswordResetCodeMutation = () => {
  return useAppMutation({ mutationFn: verifyPasswordResetCode });
};

// 비밀번호 재설정 mutation
export const useResetPasswordMutation = () => {
  return useAppMutation({ mutationFn: resetPassword });
};
