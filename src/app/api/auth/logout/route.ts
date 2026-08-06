import { NextResponse } from "next/server";

// 로그아웃 mock (refreshToken 쿠키 삭제)
export async function POST() {
  const response = NextResponse.json({ success: true, code: "OK", message: "로그아웃 되었습니다.", data: null });
  response.cookies.delete("refreshToken");
  return response;
}
