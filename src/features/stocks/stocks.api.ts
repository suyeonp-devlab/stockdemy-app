import { request } from "@/shared/lib/axios";
import { Disclosure, StockDetail, StockListItem } from "@/features/stocks/stocks.type";

// 종목 목록
export const getStockList = () =>
  request<StockListItem[]>({ method: "GET", url: "/api/stocks" });

// 오늘의 공시
export const getDisclosures = () =>
  request<Disclosure[]>({ method: "GET", url: "/api/stocks/disclosures" });

// 종목 상세
export const getStockDetail = (code: string) =>
  request<StockDetail>({ method: "GET", url: `/api/stocks/${code}` });
