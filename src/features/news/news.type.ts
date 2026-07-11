import { AiSentiment } from "@/features/dashboard/dashboard.type";

// 뉴스 카테고리
export type NewsCategory = "국내" | "해외";

// 뉴스 목록 항목
export interface NewsListItem {
  id: string;
  stockName: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: NewsCategory;
  sentiment: AiSentiment;
}

// 오늘의 시장 감성 비율
export interface SentimentSummary {
  positive: number;
  neutral: number;
  negative: number;
  totalCount: number;
}

// 많이 언급된 종목
export interface MentionRanking {
  stockName: string;
  count: number;
}
