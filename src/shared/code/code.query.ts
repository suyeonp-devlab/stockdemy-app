import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { getCommonCodes } from "@/shared/code/code.api";
import { CodeRequest } from "@/shared/code/code.type";

const CODE_QUERY_KEYS = {
  all: () => ["codes"] as const,
  lists: () => [...CODE_QUERY_KEYS.all(), "lists"] as const,
  list: (params: CodeRequest) => [...CODE_QUERY_KEYS.lists(), params] as const,
};

// 공통코드 조회 query
export const useGetCommonCodesQuery = (params: CodeRequest) => {

  return useAppQuery({
    queryKey: CODE_QUERY_KEYS.list(params),
    queryFn: () => getCommonCodes(params),
  });
};
