import { NextResponse } from "next/server";

// 회원가입 인증코드 확인 mock
export async function POST() {

  // 성공 응답
  return NextResponse.json({ success: true, code: "OK", message: "인증이 완료되었습니다.", data: null });

  // 실패 응답 (인증코드 불일치)
  // return NextResponse.json({ success: false, code: "CODE_MISMATCH", message: "인증코드가 일치하지 않습니다.", data: null }, { status: 400 });

  // 실패 응답 (인증코드 만료)
  // return NextResponse.json({ success: false, code: "CODE_EXPIRED", message: "인증코드가 만료되었습니다.", data: null }, { status: 400 });
}
