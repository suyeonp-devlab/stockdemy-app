import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { getDisclosures, getStockDetail, getStockList } from "@/features/stocks/stocks.api";

// 종목 목록 조회
export const useStockListQuery = () => {
  return useAppQuery({ queryKey: ["stocks"], queryFn: getStockList, loading: false });
};

// 오늘의 공시 조회
export const useDisclosuresQuery = () => {
  return useAppQuery({ queryKey: ["stocks", "disclosures"], queryFn: getDisclosures, loading: false });
};

// 종목 상세 조회
export const useStockDetailQuery = (code: string) => {
  return useAppQuery({ queryKey: ["stocks", code], queryFn: () => getStockDetail(code), loading: false });
};
