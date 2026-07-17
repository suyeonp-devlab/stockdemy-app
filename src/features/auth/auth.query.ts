import { useQueryClient } from "@tanstack/react-query";
import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { getMe, logout } from "@/features/auth/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";

const AUTH_QUERY_KEYS = {
  all: () => ["auth"] as const,
  me: () => [...AUTH_QUERY_KEYS.all(), "me"] as const,
};

// 내 정보 조회 query
export const useGetMeQuery = () => {

  return useAppQuery({
    queryKey: AUTH_QUERY_KEYS.me(),
    queryFn: getMe,
    retry: false,
    loading: false,
  });
};

// 로그아웃 mutation
export const useLogoutMutation = () => {

  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: logout,
    onSuccess: () => {
      useAuthStore.getState().logout();
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
    },
  });
};
