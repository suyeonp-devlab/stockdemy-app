import { NextRequest, NextResponse } from "next/server";
import { buildTodayQuote } from "@/app/api/stocks/_mock";

// 실시간 시세 mock (폴링 전용)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ code: string }> }) {

  const { code } = await params;
  const quote = buildTodayQuote(code);

  if (!quote) {
    return NextResponse.json({ success: false, code: "NOT_FOUND", message: "존재하지 않는 종목입니다.", data: null }, { status: 404 });
  }

  return NextResponse.json({ success: true, code: "OK", message: "조회 성공", data: quote });
}
