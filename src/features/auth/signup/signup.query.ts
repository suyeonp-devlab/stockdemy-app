import { useAppMutation } from "@/shared/hooks/useAppMutation";
import {
  googleSignup,
  sendSignupCode,
  signup,
  verifySignupCode
} from "@/features/auth/signup/signup.api";

// 인증코드 발송 mutation
export const useSendSignupCodeMutation = () => {
  return useAppMutation({ mutationFn: sendSignupCode });
};

// 인증코드 검증 mutation
export const useVerifySignupCodeMutation = () => {
  return useAppMutation({ mutationFn: verifySignupCode });
};

// 회원가입 mutation
export const useSignupMutation = () => {
  return useAppMutation({ mutationFn: signup });
};

// 구글 회원가입 mutation
export const useGoogleSignupMutation = () => {
  return useAppMutation({ mutationFn: googleSignup });
};