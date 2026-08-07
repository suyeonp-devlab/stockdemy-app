import { NextRequest, NextResponse } from "next/server";
import { buildPriceBars, STOCK_BASE } from "@/app/api/stocks/_mock";

// 일별 시세 mock (30일치, 마지막 항목은 오늘 봉)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ code: string }> }) {

  const { code } = await params;

  if (!STOCK_BASE[code]) {
    return NextResponse.json({ success: false, code: "NOT_FOUND", message: "존재하지 않는 종목입니다.", data: null }, { status: 404 });
  }

  const items = buildPriceBars(code);

  return NextResponse.json({ success: true, code: "OK", message: "조회 성공", data: items });
}
