import { NextRequest, NextResponse } from "next/server";

// 공통코드 그룹별 mock ("전체" 옵션은 클라이언트(common-code.api)에서 추가하므로 제외)
const COMMON_CODES: Record<string, { groupNm: string; items: { codeId: string; codeNm: string; sortNo: number; useYn: string }[] }> = {
  NEWS_CATEGORY: {
    groupNm: "뉴스 카테고리",
    items: [
      { codeId: "DOMESTIC", codeNm: "국내", sortNo: 1, useYn: "Y" },
      { codeId: "OVERSEAS", codeNm: "해외", sortNo: 2, useYn: "Y" },
    ],
  },
  NEWS_SENTIMENT: {
    groupNm: "AI 뉴스 평가",
    items: [
      { codeId: "POSITIVE", codeNm: "긍정", sortNo: 1, useYn: "Y" },
      { codeId: "NEUTRAL", codeNm: "중립", sortNo: 2, useYn: "Y" },
      { codeId: "NEGATIVE", codeNm: "부정", sortNo: 3, useYn: "Y" },
    ],
  },
  NEWS_IMPACT: {
    groupNm: "관련 종목 영향",
    items: [
      { codeId: "BENEFIT", codeNm: "동반 수혜", sortNo: 1, useYn: "Y" },
      { codeId: "LIMITED", codeNm: "제한적 영향", sortNo: 2, useYn: "Y" },
      { codeId: "ADVERSE", codeNm: "동반 약세", sortNo: 3, useYn: "Y" },
    ],
  },
  STOCK_MARKET: {
    groupNm: "주식 시장",
    items: [
      { codeId: "KOSPI", codeNm: "KOSPI", sortNo: 1, useYn: "Y" },
      { codeId: "KOSDAQ", codeNm: "KOSDAQ", sortNo: 2, useYn: "Y" },
      { codeId: "NASDAQ", codeNm: "NASDAQ", sortNo: 3, useYn: "Y" },
    ],
  },
  STOCK_SECTOR: {
    groupNm: "주식 업종",
    items: [
      { codeId: "ELECTRONICS", codeNm: "전기전자", sortNo: 1, useYn: "Y" },
      { codeId: "CHEMICAL", codeNm: "화학", sortNo: 2, useYn: "Y" },
      { codeId: "TRANSPORT_EQUIPMENT", codeNm: "운수장비", sortNo: 3, useYn: "Y" },
      { codeId: "PHARMACEUTICAL", codeNm: "의약품", sortNo: 4, useYn: "Y" },
      { codeId: "FINANCIAL", codeNm: "금융업", sortNo: 5, useYn: "Y" },
      { codeId: "STEEL_METAL", codeNm: "철강금속", sortNo: 6, useYn: "Y" },
      { codeId: "CONSTRUCTION", codeNm: "건설업", sortNo: 7, useYn: "Y" },
      { codeId: "RETAIL", codeNm: "유통업", sortNo: 8, useYn: "Y" },
      { codeId: "FOOD_BEVERAGE", codeNm: "음식료품", sortNo: 9, useYn: "Y" },
      { codeId: "TEXTILE_APPAREL", codeNm: "섬유의복", sortNo: 10, useYn: "Y" },
      { codeId: "PAPER_WOOD", codeNm: "종이목재", sortNo: 11, useYn: "Y" },
      { codeId: "NON_METALLIC_MINERAL", codeNm: "비금속광물", sortNo: 12, useYn: "Y" },
      { codeId: "MACHINERY", codeNm: "기계", sortNo: 13, useYn: "Y" },
      { codeId: "MEDICAL_PRECISION", codeNm: "의료정밀", sortNo: 14, useYn: "Y" },
      { codeId: "ELECTRIC_GAS", codeNm: "전기가스업", sortNo: 15, useYn: "Y" },
      { codeId: "TRANSPORT_STORAGE", codeNm: "운수창고업", sortNo: 16, useYn: "Y" },
      { codeId: "TELECOMMUNICATION", codeNm: "통신업", sortNo: 17, useYn: "Y" },
      { codeId: "SERVICE", codeNm: "서비스업", sortNo: 18, useYn: "Y" },
      { codeId: "BANK", codeNm: "은행", sortNo: 19, useYn: "Y" },
      { codeId: "SECURITIES", codeNm: "증권", sortNo: 20, useYn: "Y" },
      { codeId: "INSURANCE", codeNm: "보험", sortNo: 21, useYn: "Y" },
    ],
  },
  TRADE_TYPE: {
    groupNm: "거래 유형",
    items: [
      { codeId: "BUY", codeNm: "매수", sortNo: 1, useYn: "Y" },
      { codeId: "SELL", codeNm: "매도", sortNo: 2, useYn: "Y" },
    ],
  },
  JOURNAL_PERIOD: {
    groupNm: "주식일지 기간 필터",
    items: [
      { codeId: "1M", codeNm: "최근 1개월", sortNo: 1, useYn: "Y" },
      { codeId: "3M", codeNm: "최근 3개월", sortNo: 2, useYn: "Y" },
      { codeId: "6M", codeNm: "최근 6개월", sortNo: 3, useYn: "Y" },
      { codeId: "12M", codeNm: "최근 1년", sortNo: 4, useYn: "Y" },
    ],
  },
  JOURNAL_STATUS: {
    groupNm: "주식일지 상태",
    items: [
      { codeId: "DONE", codeNm: "AI 분석 완료", sortNo: 1, useYn: "Y" },
      { codeId: "PENDING", codeNm: "AI 분석 중", sortNo: 2, useYn: "Y" },
      { codeId: "STANDBY", codeNm: "분석 대기", sortNo: 3, useYn: "Y" },
    ],
  },
};

// 공통코드 조회 mock
export async function GET(_request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {

  const { groupId } = await params;
  const group = COMMON_CODES[groupId];

  if (!group) {
    return NextResponse.json({ success: false, code: "NOT_FOUND", message: "존재하지 않는 공통코드 그룹입니다.", data: null }, { status: 404 });
  }

  return NextResponse.json({
    success: true, code: "OK", message: "조회 성공",
    data: { groupId, groupNm: group.groupNm, items: group.items },
  });
}
