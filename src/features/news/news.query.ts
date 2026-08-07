import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { getNewsDetail, getNewsList, getSentimentSummary, getTopMentions } from "@/features/news/news.api";
import { NewsRequest } from "@/features/news/news.type";

export const NEWS_QUERY_KEYS = {
  all: () => ["news"] as const,
  lists: () => [...NEWS_QUERY_KEYS.all(), "lists"] as const,
  list: (params: NewsRequest) => [...NEWS_QUERY_KEYS.lists(), params] as const,
  details: () => [...NEWS_QUERY_KEYS.all(), "details"] as const,
  detail: (id: number) => [...NEWS_QUERY_KEYS.details(), id] as const,
  summary: () => [...NEWS_QUERY_KEYS.all(), "summary"] as const,
  mention: () => [...NEWS_QUERY_KEYS.all(), "mention"] as const,
};

// 뉴스 목록 조회 query
export const useGetNewsListQuery = (params: NewsRequest | null) => {

  const enabled = !!params;

  return useAppQuery({
    queryKey: enabled ? NEWS_QUERY_KEYS.list(params) : NEWS_QUERY_KEYS.lists(),
    queryFn: () => getNewsList(params!),
    enabled,
  });
};

// 뉴스 상세 조회 query
export const useGetNewsDetailQuery = (id: number | null) => {

  const enabled = !!id;

  return useAppQuery({
    queryKey: enabled ? NEWS_QUERY_KEYS.detail(id) : NEWS_QUERY_KEYS.details(),
    queryFn: () => getNewsDetail(id!),
    enabled,
  });
};

// 오늘의 시장 평가 조회 query
export const useGetSentimentSummaryQuery = () => {

  return useAppQuery({
    queryKey: NEWS_QUERY_KEYS.summary(),
    queryFn: getSentimentSummary,
  });
};

// 많이 언급된 종목 조회 query
export const useGetTopMentionsQuery = () => {

  return useAppQuery({
    queryKey: NEWS_QUERY_KEYS.mention(),
    queryFn: getTopMentions,
  });
};
