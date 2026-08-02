import { useQueryClient } from "@tanstack/react-query";
import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { useAppMutation } from "@/shared/hooks/useAppMutation";
import {
  getDisclosureList,
  getMinuteBarList,
  getPriceBarList,
  getStockFundamentals,
  getStockList,
  getStockQuotes,
  getTodayQuote,
  toggleStockFavorite,
} from "@/features/stock/stock.api";
import { StockRequest } from "@/features/stock/stock.type";

export const STOCK_QUERY_KEYS = {
  all: () => ["stock"] as const,
  lists: () => [...STOCK_QUERY_KEYS.all(), "lists"] as const,
  list: (params: StockRequest) => [...STOCK_QUERY_KEYS.lists(), params] as const,
  listQuotes: () => [...STOCK_QUERY_KEYS.all(), "list-quotes"] as const,
  listQuote: (stockCodes: string[]) => [...STOCK_QUERY_KEYS.listQuotes(), stockCodes] as const,
  details: () => [...STOCK_QUERY_KEYS.all(), "details"] as const,
  detail: (stockCode: string) => [...STOCK_QUERY_KEYS.details(), stockCode] as const,
  priceBars: () => [...STOCK_QUERY_KEYS.all(), "price-bars"] as const,
  priceBar: (stockCode: string) => [...STOCK_QUERY_KEYS.priceBars(), stockCode] as const,
  minuteBars: () => [...STOCK_QUERY_KEYS.all(), "minute-bars"] as const,
  minuteBar: (stockCode: string) => [...STOCK_QUERY_KEYS.minuteBars(), stockCode] as const,
  quotes: () => [...STOCK_QUERY_KEYS.all(), "quotes"] as const,
  quote: (stockCode: string) => [...STOCK_QUERY_KEYS.quotes(), stockCode] as const,
  disclosures: () => [...STOCK_QUERY_KEYS.all(), "disclosures"] as const,
  disclosure: (stockCode: string) => [...STOCK_QUERY_KEYS.disclosures(), stockCode] as const,
};

// 종목 목록 조회 query
export const useGetStockListQuery = (params: StockRequest | null) => {

  const enabled = !!params;

  return useAppQuery({
    queryKey: enabled ? STOCK_QUERY_KEYS.list(params) : STOCK_QUERY_KEYS.lists(),
    queryFn: () => getStockList(params!),
    enabled,
  });
};

// 종목 목록 실시간 시세 조회 query
export const useGetStockQuotesQuery = (stockCodes: string[] | null) => {

  const enabled = !!stockCodes && stockCodes.length > 0;

  return useAppQuery({
    queryKey: enabled ? STOCK_QUERY_KEYS.listQuote(stockCodes) : STOCK_QUERY_KEYS.listQuotes(),
    queryFn: () => getStockQuotes(stockCodes!),
    // 5초마다 폴링
    refetchInterval: enabled ? 5000 : false,
    enabled,
  });
};

// 종목 기초데이터 조회 query
export const useGetStockFundamentalsQuery = (stockCode: string | null) => {

  const enabled = !!stockCode;

  return useAppQuery({
    queryKey: enabled ? STOCK_QUERY_KEYS.detail(stockCode) : STOCK_QUERY_KEYS.details(),
    queryFn: () => getStockFundamentals(stockCode!),
    enabled,
  });
};

// 일별 시세 조회 query
export const useGetPriceBarListQuery = (stockCode: string | null) => {

  const enabled = !!stockCode;

  return useAppQuery({
    queryKey: enabled ? STOCK_QUERY_KEYS.priceBar(stockCode) : STOCK_QUERY_KEYS.priceBars(),
    queryFn: () => getPriceBarList(stockCode!),
    enabled,
  });
};

// 분당 시세 조회 query
export const useGetMinuteBarListQuery = (stockCode: string | null) => {

  const enabled = !!stockCode;

  return useAppQuery({
    queryKey: enabled ? STOCK_QUERY_KEYS.minuteBar(stockCode) : STOCK_QUERY_KEYS.minuteBars(),
    queryFn: () => getMinuteBarList(stockCode!),
    enabled,
  });
};

// 실시간 시세 조회 query
export const useGetTodayQuoteQuery = (stockCode: string | null) => {

  const enabled = !!stockCode;

  return useAppQuery({
    queryKey: enabled ? STOCK_QUERY_KEYS.quote(stockCode) : STOCK_QUERY_KEYS.quotes(),
    queryFn: () => getTodayQuote(stockCode!),
    // 5초마다 폴링 → 장마감 시 자동 정지
    refetchInterval: (query) => query.state.data?.isMarketOpen ? 5000 : false,
    enabled,
  });
};

// 오늘의 공시 조회 query
export const useGetDisclosureListQuery = (stockCode?: string | null) => {

  return useAppQuery({
    queryKey: stockCode ? STOCK_QUERY_KEYS.disclosure(stockCode) : STOCK_QUERY_KEYS.disclosures(),
    queryFn: () => getDisclosureList(stockCode ?? ""),
  });
};

// 관심종목 등록 및 해제 mutation
export const useToggleStockFavoriteMutation = () => {

  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: toggleStockFavorite,
    loading: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.details() });
    }
  });
};
