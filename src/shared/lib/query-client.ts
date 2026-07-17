import { QueryClient } from "@tanstack/react-query";

// QueryClient 생성 (공통 기본 옵션)
const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
};

// 브라우저 전용 인스턴스
let browserQueryClient: QueryClient | undefined;

/** 실행 환경에 맞는 QueryClient 반환 → 서버: 호출마다 새로 생성, 브라우저: 싱글톤 */
export const getQueryClient = () => {
  if (typeof window === "undefined") return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
};
