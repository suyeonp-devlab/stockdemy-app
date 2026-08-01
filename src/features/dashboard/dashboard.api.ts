import { requestRequired } from "@/shared/lib/axios";
import { MarketIndex, SectorSummary } from "@/features/dashboard/dashboard.type";

// 시장 지수 및 환율 조회
export const getMarketIndices = async () => {
  return requestRequired<MarketIndex[]>({ method: "GET", url: "/api/market/indices" });
}

// 업종별 등락 요약 조회
export const getSectorSummaries = async () => {
  return requestRequired<SectorSummary[]>({ method: "GET", url: "/api/market/sectors" });
}