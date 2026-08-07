import { request, requestRequired } from "@/shared/lib/axios";
import {
  CreateJournalRequest,
  Journal,
  JournalRequest,
  JournalResponse,
  UpdateJournalRequest
} from "@/features/journal/journal.type";

// 주식 일지 목록 조회
export const getJournalList = async (params: JournalRequest) => {
  return requestRequired<JournalResponse>({ method: "GET", url: "/api/journals", params });
}

// 주식 일지 단건 조회
export const getJournal = async (id: string) => {
  return requestRequired<Journal>({ method: "GET", url: `/api/journals/${id}` });
}

// 주식 일지 생성
export const createJournal = async (data: CreateJournalRequest) => {
  await request<void>({ method: "POST", url: "/api/journals", data });
}

// 주식 일지 수정
export const updateJournal = async (data: UpdateJournalRequest) => {
  await request<void>({ method: "PUT", url: `/api/journals/${data.id}`, data });
}

// AI 복기 분석 요청
export const requestAiReview = async (id: string) => {
  await request<void>({ method: "POST", url: `/api/journals/${id}/ai-review` });
}
