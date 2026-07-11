import { request } from "@/shared/lib/axios";
import { MarketIndex, NewsItem, SectorSummary, StockSummary } from "@/features/dashboard/dashboard.type";

// 지수/환율
export const getMarketIndices = () =>
  request<MarketIndex[]>({ method: "GET", url: "/api/market/indices" });

// 거래량 상위 종목
export const getTopVolumeStocks = () =>
  request<StockSummary[]>({ method: "GET", url: "/api/market/top-volume" });

// 주목할만한 뉴스
export const getNewsHighlights = () =>
  request<NewsItem[]>({ method: "GET", url: "/api/news/highlights" });

// 업종별 등락
export const getSectorSummaries = () =>
  request<SectorSummary[]>({ method: "GET", url: "/api/market/sectors" });
