import { useAppQuery } from "@/shared/hooks/useAppQuery";
import {
  getMarketIndices,
  getNewsHighlights,
  getSectorSummaries,
  getTopVolumeStocks
} from "@/features/dashboard/dashboard.api";

// 지수/환율 조회
export const useMarketIndicesQuery = () => {
  return useAppQuery({ queryKey: ["market", "indices"], queryFn: getMarketIndices, loading: false });
};

// 거래량 상위 종목 조회
export const useTopVolumeStocksQuery = () => {
  return useAppQuery({ queryKey: ["market", "top-volume"], queryFn: getTopVolumeStocks, loading: false });
};

// 주목할만한 뉴스 조회
export const useNewsHighlightsQuery = () => {
  return useAppQuery({ queryKey: ["news", "highlights"], queryFn: getNewsHighlights, loading: false });
};

// 업종별 등락 조회
export const useSectorSummariesQuery = () => {
  return useAppQuery({ queryKey: ["market", "sectors"], queryFn: getSectorSummaries, loading: false });
};
