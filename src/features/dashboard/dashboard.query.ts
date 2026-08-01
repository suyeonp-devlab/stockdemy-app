import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { getMarketIndices, getSectorSummaries } from "@/features/dashboard/dashboard.api";

export const DASHBOARD_QUERY_KEYS = {
  all: () => ["dashboard"] as const,
  indices: () => [...DASHBOARD_QUERY_KEYS.all(), "indices"] as const,
  sectors: () => [...DASHBOARD_QUERY_KEYS.all(), "sectors"] as const,
};

// 시장 지수 및 환율 조회 query
export const useGetMarketIndicesQuery = () => {

  return useAppQuery({
    queryKey: DASHBOARD_QUERY_KEYS.indices(),
    queryFn: getMarketIndices,
    loading: false
  });
};

// 업종별 등락 요약 조회 query
export const useGetSectorSummariesQuery = () => {

  return useAppQuery({
    queryKey: DASHBOARD_QUERY_KEYS.sectors(),
    queryFn: getSectorSummaries,
    loading: false
  });
};
