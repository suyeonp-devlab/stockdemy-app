import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { getNewsList, getSentimentSummary, getTopMentions } from "@/features/news/news.api";

// 뉴스 목록 조회
export const useNewsListQuery = () => {
  return useAppQuery({ queryKey: ["news", "list"], queryFn: getNewsList, loading: false });
};

// 오늘의 시장 감성 조회
export const useSentimentSummaryQuery = () => {
  return useAppQuery({ queryKey: ["news", "sentiment-summary"], queryFn: getSentimentSummary, loading: false });
};

// 많이 언급된 종목 조회
export const useTopMentionsQuery = () => {
  return useAppQuery({ queryKey: ["news", "top-mentions"], queryFn: getTopMentions, loading: false });
};
