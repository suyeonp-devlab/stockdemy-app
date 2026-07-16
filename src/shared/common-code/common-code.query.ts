import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { getCommonCodes } from "@/shared/common-code/common-code.api";
import { CommonCodeRequest } from "@/shared/common-code/common-code.type";

const COMMON_CODE_QUERY_KEYS = {
  all: () => ["common-codes"] as const,
  lists: () => [...COMMON_CODE_QUERY_KEYS.all(), "lists"] as const,
  list: (params: CommonCodeRequest) => [...COMMON_CODE_QUERY_KEYS.lists(), params] as const,
};

// 공통코드 조회 query
export const useGetCommonCodesQuery = (params: CommonCodeRequest) => {

  return useAppQuery({
    queryKey: COMMON_CODE_QUERY_KEYS.list(params),
    queryFn: () => getCommonCodes(params),
    loading: false,
  });
};
