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
  id: number;
  stockCode: string;
  stockName: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: string;
  categoryNm: string;
  sentiment: string;
  sentimentNm: string;
  sourceUrl: string;
  sourceName: string;
}

// 뉴스 상세
export interface NewsDetail extends News {
  confidence: number;
  reasoning: string;
  relatedStocks: NewsRelatedStock[];
}

// 뉴스 관련 종목 영향
export interface NewsRelatedStock {
  stockCode: string;
  stockName: string;
  impact: string;
  impactNm: string;
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
