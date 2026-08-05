import { useQueryClient } from "@tanstack/react-query";
import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { withdraw } from "@/features/auth/withdraw/withdraw.api";
import { useAuthStore } from "@/shared/store/auth.store";

// 회원 탈퇴 mutation
export const useWithdrawMutation = () => {

  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      useAuthStore.getState().logout();
      queryClient.clear();
    },
  });
};
