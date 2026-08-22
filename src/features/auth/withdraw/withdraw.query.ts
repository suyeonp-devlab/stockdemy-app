import { useQueryClient } from "@tanstack/react-query";
import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { googleWithdraw, withdraw } from "@/features/auth/withdraw/withdraw.api";
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

// 구글 회원 탈퇴 mutation
export const useGoogleWithdrawMutation = () => {

  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: googleWithdraw,
    onSuccess: () => {
      useAuthStore.getState().logout();
      queryClient.clear();
    },
  });
};
