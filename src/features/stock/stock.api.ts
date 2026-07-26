import { request, requestRequired } from "@/shared/lib/axios";
import {
  Disclosure,
  MinuteBar,
  PriceBar,
  StockFavoriteRequest,
  StockFundamentals,
  StockRequest,
  StockResponse,
  TodayQuote
} from "@/features/stock/stock.type";

// 종목 목록 조회
export const getStockList = async (params: StockRequest) => {
  return requestRequired<StockResponse>({ method: "GET", url: "/api/stocks", params });
}

// 종목 기초데이터 조회
export const getStockFundamentals = async (stockCode: string) => {
  return request<StockFundamentals>({ method: "GET", url: `/api/stocks/${stockCode}/fundamentals`, meta: { skipErrorAlert: true } });
}

// 일별 시세 조회
export const getPriceBarList = async (stockCode: string) => {
  return requestRequired<PriceBar[]>({ method: "GET", url: `/api/stocks/${stockCode}/price-bars` });
}

// 분당 시세 조회
export const getMinuteBarList = async (stockCode: string) => {
  return requestRequired<MinuteBar[]>({ method: "GET", url: `/api/stocks/${stockCode}/minute-bars` });
}

// 실시간 시세 조회
export const getTodayQuote = async (stockCode: string) => {
  return request<TodayQuote>({ method: "GET", url: `/api/stocks/${stockCode}/quote`, meta: { skipErrorAlert: true } });
}

// 오늘의 공시 조회
export const getDisclosureList = async (stockCode: string) => {
  return requestRequired<Disclosure[]>({ method: "GET", url: "/api/stocks/disclosures", params: { stockCode } });
}

// 관심종목 등록 및 해제
export const toggleStockFavorite = async (data: StockFavoriteRequest) => {
  await request<void>({ method: "PUT", url: "/api/stocks/favorite", data });
}

