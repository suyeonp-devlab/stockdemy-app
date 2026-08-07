import { NextResponse } from "next/server";

// 많이 언급된 종목 mock
export async function GET() {
  return NextResponse.json({
    success: true, code: "OK", message: "조회 성공",
    data: [
      { stockCode: "005930", stockName: "삼성전자", count: 12 },
      { stockCode: "000660", stockName: "SK하이닉스", count: 8 },
      { stockCode: "005380", stockName: "현대차", count: 6 },
      // { stockCode: "035720", stockName: "카카오", count: 5 },
      // { stockCode: "035420", stockName: "NAVER", count: 4 },
    ],
  });
}
