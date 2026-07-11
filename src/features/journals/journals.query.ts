import { useQueryClient } from "@tanstack/react-query";
import { useAppQuery } from "@/shared/hooks/useAppQuery";
import { useAppMutation } from "@/shared/hooks/useAppMutation";
import { createJournal, getJournals, requestAiReview } from "@/features/journals/journals.api";

// 주식 일지 목록 조회
export const useJournalsQuery = () => {
  return useAppQuery({ queryKey: ["journals"], queryFn: getJournals, loading: false });
};

// 주식 일지 작성
export const useCreateJournalMutation = () => {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: createJournal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journals"] }),
  });
};

// AI 복기 분석 요청
export const useRequestAiReviewMutation = () => {
  const queryClient = useQueryClient();
  return useAppMutation({
    mutationFn: requestAiReview,
    loading: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journals"] }),
  });
};
