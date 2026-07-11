import { request, requestRequired } from "@/shared/lib/axios";
import { CreateJournalPayload, JournalEntry } from "@/features/journals/journals.type";

// 주식 일지 목록
export const getJournals = () =>
  request<JournalEntry[]>({ method: "GET", url: "/api/journals" });

// 주식 일지 작성
export const createJournal = (payload: CreateJournalPayload) =>
  requestRequired<JournalEntry>({ method: "POST", url: "/api/journals", data: payload });

// AI 복기 분석 요청
export const requestAiReview = (id: string) =>
  requestRequired<JournalEntry>({ method: "POST", url: `/api/journals/${id}/ai-review` });
