import { NextRequest, NextResponse } from "next/server";
import { Journal } from "@/features/journal/journal.type";
import { findJournalById, STATUS_NM } from "@/app/api/journals/_store";

// AI 분석 소요 시간 (mock)
const AI_REVIEW_DELAY_MS = 3000;

// AI 복기 코멘트 생성 (mock)
function generateAiComment(entry: Journal) {
  const [, month, day] = entry.tradeDate.split("-");
  const dateLabel = `${Number(month)}월 ${Number(day)}일`;
  const memoPart = entry.memo ? `"${entry.memo}"라고 메모하셨는데, ` : "";
  const verdict = entry.tradeType === "BUY"
    ? "당시 시장 흐름을 고려하면 진입 타이밍 자체는 무리한 선택은 아니었던 것으로 보여요."
    : "당시 상황을 감안하면 리스크 관리 차원에서 합리적인 결정으로 볼 수 있어요.";
  return `${dateLabel} ${entry.stockName} ${entry.tradeTypeNm} 기록을 살펴봤어요. ${memoPart}${verdict} 다만 이후 시세와 관련 뉴스 흐름도 함께 참고하면서 다음 판단에 반영해보세요.`;
}

// 주식 일지 AI 복기 분석 요청 (분석 대기 → 분석 중 → 완료)
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const entry = findJournalById(id);

  if (!entry) {
    return NextResponse.json({ success: false, code: "NOT_FOUND", message: "존재하지 않는 일지입니다.", data: null }, { status: 404 });
  }

  if (entry.status !== "STANDBY") {
    return NextResponse.json({ success: false, code: "NOT_REQUESTABLE", message: "이미 분석을 요청한 일지입니다.", data: null }, { status: 400 });
  }

  entry.status = "PENDING";
  entry.statusNm = STATUS_NM.PENDING;

  // 분석 중 → 완료 (mock 비동기 처리, 서버 프로세스가 살아있는 동안만 유효)
  setTimeout(() => {
    entry.aiComment = generateAiComment(entry);
    entry.status = "DONE";
    entry.statusNm = STATUS_NM.DONE;
  }, AI_REVIEW_DELAY_MS);

  return NextResponse.json({ success: true, code: "OK", message: "AI 복기 분석 요청이 접수되었습니다.", data: entry });
}
