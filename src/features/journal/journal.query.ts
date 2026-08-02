import { useQueryClient } from "@tanstack/react-query";
import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { createJournal, getJournalList, requestAiReview, updateJournal } from "@/features/journal/journal.api";

export const JOURNAL_QUERY_KEYS = {
  all: () => ["journal"] as const,
  lists: () => [...JOURNAL_QUERY_KEYS.all(), "lists"] as const,
};

// 주식 일지 목록 조회 query
export const useGetJournalListQuery = () => {

  return useAppQuery({
    queryKey: JOURNAL_QUERY_KEYS.lists(),
    queryFn: getJournalList
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
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.lists() })
    }
  });
};

// AI 복기 분석 요청 mutation
export const useRequestAiReviewMutation = () => {

  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: requestAiReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: JOURNAL_QUERY_KEYS.lists() })
    }
  });
};
