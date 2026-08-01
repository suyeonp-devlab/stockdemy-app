import { request, requestRequired } from "@/shared/lib/axios";
import { MentionRanking, NewsDetail, NewsRequest, NewsResponse, SentimentSummary } from "@/features/news/news.type";

// 뉴스 목록 조회
export const getNewsList = async (params: NewsRequest) => {
  return requestRequired<NewsResponse>({ method: "GET", url: "/api/news", params });
}

// 뉴스 상세 조회
export const getNewsDetail = async (id: number) => {
  return request<NewsDetail>({ method: "GET", url: `/api/news/${id}`, meta: { skipErrorAlert: true } });
}

// 오늘의 시장 평가 조회
export const getSentimentSummary = async () => {
  return requestRequired<SentimentSummary>({ method: "GET", url: "/api/news/sentiment-summary", meta: { skipErrorAlert: true } });
}

// 많이 언급된 종목 조회
export const getTopMentions = async () => {
  return requestRequired<MentionRanking[]>({ method: "GET", url: "/api/news/top-mentions", meta: { skipErrorAlert: true } });
}