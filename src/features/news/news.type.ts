// 뉴스 request
export interface NewsRequest {
  category: string;
  stockName: string;
  favorite: boolean;
  page: number;
  pageSize: number;
}

// 뉴스 response
export interface NewsResponse {
  totalCount: number;
  totalPages: number;
  items: News[];
}

// 뉴스 항목
export interface News {
  id: string;
  stockName: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: string;
  categoryNm: string;
  sentiment: string;
  sentimentNm: string;
}

// 오늘의 시장 평가
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
