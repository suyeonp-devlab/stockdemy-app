import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { login, googleLogin } from "@/features/auth/login/login.api";

// 로그인 mutation
export const useLoginMutation = () => {
  return useAppMutation({ mutationFn: login });
};

// 구글 로그인 mutation
export const useGoogleLoginMutation = () => {
  return useAppMutation({ mutationFn: googleLogin });
};
