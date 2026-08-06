import { NextRequest, NextResponse } from "next/server";
import { StockFavoriteRequest } from "@/features/stock/stock.type";
import { setFavoriteStock } from "@/app/api/stocks/_store";

// 관심종목 등록/해제
export async function PUT(request: NextRequest) {

  const body: StockFavoriteRequest = await request.json();
  setFavoriteStock(body.stockCode, body.favorite);

  return NextResponse.json({
    success: true, code: "OK",
    message: body.favorite ? "관심종목에 등록되었습니다." : "관심종목이 해제되었습니다.",
    data: null,
  });
}
