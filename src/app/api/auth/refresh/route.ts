import { NextRequest, NextResponse } from "next/server";

// 토큰 갱신 mock (refreshToken 쿠키로 accessToken 재발급)
export async function POST(request: NextRequest) {

  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ success: false, code: "UNAUTHORIZED", message: "로그인이 필요합니다.", data: null }, { status: 401 });
  }

  // 성공 응답 (새 accessToken 발급)
  return NextResponse.json({
    success: true, code: "OK", message: "토큰이 갱신되었습니다.",
    data: "mock-access-token",
  });

  // 실패 응답 (refreshToken 만료/무효)
  // return NextResponse.json({ success: false, code: "REFRESH_TOKEN_EXPIRED", message: "세션이 만료되었습니다. 다시 로그인해주세요.", data: null }, { status: 401 });
}
