import { NextRequest, NextResponse } from "next/server";

// 내 정보 조회 mock (accessToken 헤더로 인증)
export async function GET(request: NextRequest) {

  const authHeader = request.headers.get("authorization");

  if (authHeader !== "Bearer mock-access-token") {
    return NextResponse.json({ success: false, code: "UNAUTHORIZED", message: "로그인이 필요합니다.", data: null }, { status: 401 });
  }

  return NextResponse.json({
    success: true, code: "OK", message: "조회 성공",
    data: { email: "mock@stockdemy.com", createdAt: "20261210122222" },
  });
}

// 회원 탈퇴 mock (accessToken 헤더로 인증, refreshToken 쿠키 삭제)
export async function DELETE(request: NextRequest) {

  const authHeader = request.headers.get("authorization");

  if (authHeader !== "Bearer mock-access-token") {
    return NextResponse.json({ success: false, code: "UNAUTHORIZED", message: "로그인이 필요합니다.", data: null }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, code: "OK", message: "탈퇴가 완료되었습니다.", data: null });
  response.cookies.delete("refreshToken");
  return response;
}
