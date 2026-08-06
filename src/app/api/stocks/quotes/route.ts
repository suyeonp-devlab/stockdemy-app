import { NextRequest, NextResponse } from "next/server";
import { buildStock } from "@/app/api/stocks/_mock";
import { StockQuote } from "@/features/stock/stock.type";

// 종목 목록 실시간 시세 배치 mock (폴링 전용, 가격/등락률/시가총액만 반환)
export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const codes = (searchParams.get("codes") ?? "").split(",").map((code) => code.trim()).filter(Boolean);

  const quotes: StockQuote[] = codes
    .map((code) => buildStock(code))
    .filter((stock) => stock !== null)
    .map(({ stockCode, price, changePercent, marketCap }) => ({ stockCode, price, changePercent, marketCap }));

  return NextResponse.json({ success: true, code: "OK", message: "조회 성공", data: quotes });
}
