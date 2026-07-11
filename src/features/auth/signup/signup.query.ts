import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { googleSignup, sendCode, signup, verifyCode } from "@/features/auth/signup/signup.api";

// 인증코드 발송 mutation
export const useSendCodeMutation = () => {
  return useAppMutation({ mutationFn: sendCode });
};

// 인증코드 확인 mutation
export const useVerifyCodeMutation = () => {
  return useAppMutation({ mutationFn: verifyCode });
};

// 회원가입 mutation
export const useSignupMutation = () => {
  return useAppMutation({ mutationFn: signup });
};

// 구글 회원가입 mutation
export const useGoogleSignupMutation = () => {
  return useAppMutation({ mutationFn: googleSignup });
};