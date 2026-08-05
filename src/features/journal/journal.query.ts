import { useQueryClient } from "@tanstack/react-query";
import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { createJournal, getJournal, getJournalList, requestAiReview, updateJournal } from "@/features/journal/journal.api";
import { JournalRequest } from "@/features/journal/journal.type";

export const JOURNAL_QUERY_KEYS = {
  all: () => ["journal"] as const,
  lists: () => [...JOURNAL_QUERY_KEYS.all(), "lists"] as const,
  list: (params: JournalRequest) => [...JOURNAL_QUERY_KEYS.lists(), params] as const,
  details: () => [...JOURNAL_QUERY_KEYS.all(), "details"] as const,
  detail: (id: string) => [...JOURNAL_QUERY_KEYS.details(), id] as const,
};

// 주식 일지 목록 조회 query
export const useGetJournalListQuery = (params: JournalRequest | null) => {

  const enabled = !!params;

  return useAppQuery({
    queryKey: enabled ? JOURNAL_QUERY_KEYS.list(params) : JOURNAL_QUERY_KEYS.lists(),
    queryFn: () => getJournalList(params!),
    enabled,
  });
};

// 주식 일지 단건 조회 query
export const useGetJournalQuery = (id: string | null) => {

  const enabled = !!id;

  return useAppQuery({
    queryKey: enabled ? JOURNAL_QUERY_KEYS.detail(id) : JOURNAL_QUERY_KEYS.details(),
    queryFn: () => getJournal(id!),
    enabled,
  });
};

// 주식 일지 생성 mutation
export const useCreateJournalMutation = () => {

  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: createJournal,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.lists() })
    },
  });
};

// 주식 일지 수정 mutation
export const useUpdateJournalMutation = () => {

  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: updateJournal,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.details() });
    }
  });
};

// AI 복기 분석 요청 mutation
export const useRequestAiReviewMutation = () => {

  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: requestAiReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.details() });
    }
  });
};
