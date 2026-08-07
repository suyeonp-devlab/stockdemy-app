import { NextResponse } from "next/server";

// 비밀번호 재설정 인증코드 발송 mock
export async function POST() {

  // 성공 응답
  return NextResponse.json({ success: true, code: "OK", message: "인증코드가 발송되었습니다.", data: null });

  // 실패 응답 (가입되지 않은 이메일)
  // return NextResponse.json({ success: false, code: "EMAIL_NOT_FOUND", message: "가입되지 않은 이메일입니다.", data: null }, { status: 404 });
}
