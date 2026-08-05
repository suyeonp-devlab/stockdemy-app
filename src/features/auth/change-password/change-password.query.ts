import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { changePassword } from "@/features/auth/change-password/change-password.api";

// 비밀번호 변경 mutation
export const useChangePasswordMutation = () => {
  return useAppMutation({ mutationFn: changePassword });
};
