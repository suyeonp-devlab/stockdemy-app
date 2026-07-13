import { useQueryClient } from "@tanstack/react-query";
import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { getMe, logout } from "@/features/auth/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";

// 내 정보 조회 (로그인 상태 판별용)
export const useMeQuery = () => {
  return useAppQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const me = await getMe();
      useAuthStore.getState().setAccessToken(me.accessToken);
      return me;
    },
    retry: false,
    loading: false,
  });
};

// 로그아웃 mutation
export const useLogoutMutation = () => {

  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: async () => {
      await logout();
      useAuthStore.getState().logout();
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
};
