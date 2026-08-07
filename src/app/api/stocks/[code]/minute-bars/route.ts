import { NextRequest, NextResponse } from "next/server";
import { buildMinuteBars, STOCK_BASE } from "@/app/api/stocks/_mock";

// 분당 시세 mock (오늘 장 시작~현재까지 누적 분봉)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ code: string }> }) {

  const { code } = await params;

  if (!STOCK_BASE[code]) {
    return NextResponse.json({ success: false, code: "NOT_FOUND", message: "존재하지 않는 종목입니다.", data: null }, { status: 404 });
  }

  const items = buildMinuteBars(code);

  return NextResponse.json({ success: true, code: "OK", message: "조회 성공", data: items });
}
