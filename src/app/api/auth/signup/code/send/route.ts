import { NextResponse } from "next/server";

// 회원가입 인증코드 발송 mock
export async function POST() {

  // 성공 응답
  return NextResponse.json({ success: true, code: "OK", message: "인증코드가 발송되었습니다.", data: null });

  // 실패 응답 (이메일 중복)
  // return NextResponse.json({ success: false, code: "EMAIL_DUPLICATE", message: "이미 가입된 이메일입니다.", data: null }, { status: 400 });
}
