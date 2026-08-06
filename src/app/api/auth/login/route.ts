import { NextResponse } from "next/server";

// 로그인 mock
export async function POST() {

  // 성공 응답 (accessToken은 body, refreshToken은 secure 쿠키)
  const response = NextResponse.json({
    success: true, code: "OK", message: "로그인 되었습니다.",
    data: { accessToken: "mock-access-token" },
  });
  response.cookies.set("refreshToken", "mock-refresh-token", {
    httpOnly: true, secure: true, sameSite: "strict", path: "/",
  });
  return response;

  // 실패 응답 (이메일/비밀번호 불일치)
  // return NextResponse.json({ success: false, code: "INVALID_CREDENTIALS", message: "이메일 또는 비밀번호가 일치하지 않습니다.", data: null }, { status: 401 });
}
