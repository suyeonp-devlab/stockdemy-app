import { NextRequest, NextResponse } from "next/server";
import { buildFundamentals } from "@/app/api/stocks/_mock";

// 종목 펀더멘털 mock (분기 실적발표 기준 고정값)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ code: string }> }) {

  const { code } = await params;
  const fundamentals = buildFundamentals(code);

  if (!fundamentals) {
    return NextResponse.json({ success: false, code: "NOT_FOUND", message: "존재하지 않는 종목입니다.", data: null }, { status: 404 });
  }

  return NextResponse.json({ success: true, code: "OK", message: "조회 성공", data: fundamentals });
}
