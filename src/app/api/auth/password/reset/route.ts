import { NextResponse } from "next/server";

// 비밀번호 재설정 mock
export async function POST() {

  // 성공 응답
  return NextResponse.json({ success: true, code: "OK", message: "비밀번호가 재설정되었습니다.", data: null });

  // 실패 응답 (인증 미완료)
  // return NextResponse.json({ success: false, code: "CODE_NOT_VERIFIED", message: "이메일 인증이 필요합니다.", data: null }, { status: 400 });
}
