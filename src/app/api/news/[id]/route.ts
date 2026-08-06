import { NextRequest, NextResponse } from "next/server";
import { buildNewsDetail } from "@/app/api/news/_data";

// 뉴스 상세 mock
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const detail = buildNewsDetail(id);

  if (!detail) {
    return NextResponse.json({ success: false, code: "NOT_FOUND", message: "존재하지 않는 뉴스입니다.", data: null }, { status: 404 });
  }

  return NextResponse.json({ success: true, code: "OK", message: "조회 성공", data: detail });
}
