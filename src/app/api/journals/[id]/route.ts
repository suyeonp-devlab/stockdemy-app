import { NextRequest, NextResponse } from "next/server";
import { UpdateJournalRequest } from "@/features/journal/journal.type";
import { findJournalById, updateJournalById } from "@/app/api/journals/_store";

// 주식 일지 단건 조회
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const entry = findJournalById(id);

  if (!entry) {
    return NextResponse.json({ success: false, code: "NOT_FOUND", message: "존재하지 않는 일지입니다.", data: null }, { status: 404 });
  }

  return NextResponse.json({ success: true, code: "OK", message: "조회 성공", data: entry });
}

// 주식 일지 수정 (분석 대기 건만 수정 가능)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const body: UpdateJournalRequest = await request.json();

  const entry = updateJournalById(id, body);

  if (!entry) {
    return NextResponse.json({ success: false, code: "NOT_EDITABLE", message: "수정할 수 없는 일지입니다.", data: null }, { status: 400 });
  }

  return NextResponse.json({ success: true, code: "OK", message: "일지가 수정되었습니다.", data: entry });
}
