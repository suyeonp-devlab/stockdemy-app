import { NextResponse } from "next/server";

// 구글 회원가입 mock
export async function POST() {

  // 성공 응답 (accessToken은 body, refreshToken은 secure 쿠키)
  const response = NextResponse.json({
    success: true, code: "OK", message: "구글 회원가입이 완료되었습니다.",
    data: { accessToken: "mock-access-token" },
  });
  response.cookies.set("refreshToken", "mock-refresh-token", {
    httpOnly: true, secure: true, sameSite: "strict", path: "/",
  });
  return response;

  // 실패 응답 (구글 인증 실패)
  // return NextResponse.json({ success: false, code: "GOOGLE_AUTH_FAILED", message: "구글 인증에 실패했습니다.", data: null }, { status: 401 });
}
