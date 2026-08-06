import { NextRequest, NextResponse } from "next/server";

// 비밀번호 변경 mock (accessToken 헤더로 인증)
export async function PUT(request: NextRequest) {

  const authHeader = request.headers.get("authorization");

  if (authHeader !== "Bearer mock-access-token") {
    return NextResponse.json({ success: false, code: "UNAUTHORIZED", message: "로그인이 필요합니다.", data: null }, { status: 401 });
  }

  return NextResponse.json({ success: true, code: "OK", message: "비밀번호가 변경되었습니다.", data:  { accessToken: "mock-access-token" } });
}
