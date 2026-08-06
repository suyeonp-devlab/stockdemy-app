import { NextResponse } from "next/server";

// 오늘의 시장 감성 mock
export async function GET() {
  return NextResponse.json({
    success: true, code: "OK", message: "조회 성공",
    data: { positive: 65, neutral: 25, negative: 10, totalCount: 42 },
  });
}
