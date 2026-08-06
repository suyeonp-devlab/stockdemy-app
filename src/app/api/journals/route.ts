import { NextRequest, NextResponse } from "next/server";
import { CreateJournalRequest } from "@/features/journal/journal.type";
import { addJournal, buildJournal, journalStore } from "@/app/api/journals/_store";

// 주식 일지 목록 조회 (상태 필터 + 페이지네이션)
export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);

  // 필터링
  const filtered = journalStore.filter((entry) => !status || entry.status === status);

  // 정렬 (거래일시 내림차순)
  const sorted = [...filtered].sort((a, b) =>
    `${b.tradeDate}T${b.tradeTime ?? ""}`.localeCompare(`${a.tradeDate}T${a.tradeTime ?? ""}`)
  );

  // 페이지네이션
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return NextResponse.json({
    success: true, code: "OK", message: "조회 성공",
    data: { totalCount, totalPages, items },
  });
}

// 주식 일지 작성
export async function POST(request: NextRequest) {

  const body: CreateJournalRequest = await request.json();

  const entry = buildJournal(body);
  addJournal(entry);

  return NextResponse.json({ success: true, code: "OK", message: "일지가 저장되었습니다.", data: entry });
}
