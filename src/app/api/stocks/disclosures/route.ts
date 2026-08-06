import {NextRequest, NextResponse} from "next/server";

// 오늘의 공시 mock (DART 전자공시 형태)
export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  console.log(searchParams);
  const stockCode = searchParams.get("stockCode") || "";

  // 더미데이터가 stockCode를 가지고 있지 않으므로 임시로 하드코딩
  let corpName = "";
  if (stockCode === "068270")  corpName = "셀트리온";

  const disclosures = [
    { receiptNo: "20260718000001", corpName: "삼성전자", reportName: "주요사항보고서(자기주식취득결정)", receivedAt: "09:12", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000001" },
    { receiptNo: "20260718000002", corpName: "SK하이닉스", reportName: "분기보고서 (2026.03)", receivedAt: "08:47", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000002" },
    { receiptNo: "20260718000003", corpName: "현대차", reportName: "타법인주식및출자증권취득결정", receivedAt: "10:03", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000003" },
    { receiptNo: "20260718000004", corpName: "LG에너지솔루션", reportName: "유상증자결정", receivedAt: "10:21", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000004" },
    { receiptNo: "20260718000005", corpName: "카카오", reportName: "주요사항보고서(영업정지)", receivedAt: "11:05", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000005" },
    { receiptNo: "20260718000006", corpName: "POSCO홀딩스", reportName: "특수관계인에대한신용공여등결정", receivedAt: "11:38", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000006" },
    { receiptNo: "20260718000007", corpName: "셀트리온", reportName: "임상시험계획변경승인신청서제출", receivedAt: "13:02", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000007" },
    { receiptNo: "20260718000008", corpName: "NAVER", reportName: "자기주식처분결정", receivedAt: "13:47", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000008" },
    { receiptNo: "20260718000009", corpName: "Apple", reportName: "8-K 실적 발표", receivedAt: "14:15", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000009" },
    { receiptNo: "20260718000010", corpName: "NVIDIA", reportName: "8-K 신제품 공개", receivedAt: "14:50", sourceUrl: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260718000010" },
  ];

  return NextResponse.json({
    success: true, code: "OK", message: "조회 성공",
    data: disclosures.filter(item => item.corpName === corpName || corpName === ""),
  });
}
