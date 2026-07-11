import { request } from "@/shared/lib/axios";
import { MentionRanking, NewsListItem, SentimentSummary } from "@/features/news/news.type";

// 뉴스 목록
export const getNewsList = () =>
  request<NewsListItem[]>({ method: "GET", url: "/api/news" });

// 오늘의 시장 감성
export const getSentimentSummary = () =>
  request<SentimentSummary>({ method: "GET", url: "/api/news/sentiment-summary" });

// 많이 언급된 종목
export const getTopMentions = () =>
  request<MentionRanking[]>({ method: "GET", url: "/api/news/top-mentions" });
