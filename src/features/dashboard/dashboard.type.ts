// 시장 지수/환율
export interface MarketIndex {
  code: string;
  name: string;
  value: number;
  changePercent: number;
}

// AI 평가
export type AiSentiment = "긍정" | "중립" | "부정";

// 종목 요약 (거래량 상위 / 급등락 공용)
export interface StockSummary {
  code: string;
  name: string;
  price: number;
  changePercent: number;
  aiSentiment: AiSentiment;
}

// 뉴스 항목
export interface NewsItem {
  id: string;
  stockName: string;
  title: string;
  summary: string;
  publishedAt: string;
}

// 업종별 등락 요약
export interface SectorSummary {
  name: string;
  changePercent: number;
}
