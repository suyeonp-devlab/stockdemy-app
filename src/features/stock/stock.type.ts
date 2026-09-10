// 종목 request
export interface StockRequest {
  market: string;
  sector: string;
  keyword: string;
  favorite: boolean;
  topVolume: boolean;
  page: number;
  pageSize: number;
}

// 종목 response
export interface StockResponse {
  totalCount: number;
  totalPages: number;
  items: Stock[];
}

// 종목 항목
export interface Stock {
  stockCode: string;
  stockName: string;
  market: string;
  marketNm: string;
  sector: string;
  sectorNm: string;
  price: number;
  changePercent: number;
  marketCap: number;
  sentiment: string;
  sentimentNm: string;
  favorite: boolean;
}

// 종목 목록용 실시간 시세
export interface StockQuote {
  stockCode: string;
  price: number;
  changePercent: number;
  marketCap: number;
}

// 종목 기초데이터 (수집되지 않은 항목은 null 또는 응답에서 누락)
export interface StockFundamentals {
  stockCode: string;
  stockName: string;
  market: string;
  marketNm: string;
  sector: string;
  sectorNm: string;
  sentiment: string;
  sentimentNm: string;
  favorite: boolean;
  aiComment: string | null;
  prevClose: number | null;          // 전일종가
  week52High: number | null;         // 52주 최고가
  week52Low: number | null;          // 52주 최저가
  sharesOutstanding: number | null;  // 발행주식수
  foreignOwnership: number | null;   // 외국인 보유율
  eps: number | null;                // 주당순이익
  bps: number | null;                // 주당순자산
  annualDividend: number | null;     // 연간 배당금
  sectorPer: number | null;          // 동일 업종 평균 PER
}

// 일별 시세
export interface PriceBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  tradingValue: number;
}

// 분당 시세
export interface MinuteBar {
  date: string;
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  tradingValue: number;
}

// 실시간 시세
export interface TodayQuote {
  price: number;
  changePercent: number;
  todayBar: PriceBar;          // 일봉
  latestMinuteBar: MinuteBar;  // 분봉
  isMarketOpen: boolean;
  updatedAt: string;
}

// 차트용 시세
export interface ChartBar {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 오늘의 공시
export interface Disclosure {
  receiptNo: string;
  corpName: string;
  reportName: string;
  receivedAt: string;
  sourceUrl: string;
}

// 관심종목 등록 및 해제 request
export interface StockFavoriteRequest {
  stockCode: string;
  favorite: boolean;
}

// 종목 목록 tab 유형
export type TabMode = "topVolume" | "market" | "sector" | "favorite";

// 종목 목록 url 쿼리 파라미터
export interface StockURLSearchParams {
  tab?: string;
  sector?: string;
  market?: string;
  keyword?: string;
  page?: string;
}