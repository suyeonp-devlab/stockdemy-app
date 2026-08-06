import { NextResponse } from "next/server";

// 회원가입 mock
export async function POST() {

  // 성공 응답 (accessToken은 body, refreshToken은 secure 쿠키)
  const response = NextResponse.json({
    success: true, code: "OK", message: "회원가입이 완료되었습니다.",
    data: { accessToken: "mock-access-token" },
  });
  response.cookies.set("refreshToken", "mock-refresh-token", {
    httpOnly: true, secure: true, sameSite: "strict", path: "/",
  });
  return response;

  // 실패 응답 (이메일 중복)
  // return NextResponse.json({ success: false, code: "EMAIL_DUPLICATE", message: "이미 가입된 이메일입니다.", data: null }, { status: 400 });
}
