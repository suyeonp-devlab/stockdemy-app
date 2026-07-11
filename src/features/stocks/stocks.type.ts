import { AiSentiment } from "@/features/dashboard/dashboard.type";

// 시장 구분
export type Market = "KOSPI" | "KOSDAQ" | "NASDAQ";

// 종목 목록 항목
export interface StockListItem {
  code: string;
  name: string;
  market: Market;
  sector: string;
  price: number;
  changePercent: number;
  aiSentiment: AiSentiment;
  watched: boolean;
}

// 오늘의 공시 (DART 전자공시 형태)
export interface Disclosure {
  id: string;
  corpName: string;
  reportName: string;
  receivedAt: string;
}

// 일별 시세 (차트용, OHLC + 거래량)
export interface PriceBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 종목 상세
export interface StockDetail {
  code: string;
  name: string;
  market: Market;
  sector: string;
  price: number;
  changePercent: number;
  aiSentiment: AiSentiment;
  prevClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  tradingValue: number;
  week52High: number;
  week52Low: number;
  marketCap: number;
  sharesOutstanding: number;
  foreignOwnership: number;
  per: number;
  eps: number;
  pbr: number;
  bps: number;
  dividendYield: number;
  sectorPer: number;
  priceHistory: PriceBar[];
}
