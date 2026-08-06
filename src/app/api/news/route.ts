import { NextRequest, NextResponse } from "next/server";
import { ALL_NEWS } from "@/app/api/news/_data";
import { favoriteStockCodes } from "@/app/api/stocks/_store";

// 뉴스 목록 mock (카테고리/종목명 또는 티커/관심종목 필터 + 페이지네이션)
export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "";
  const stockCode = searchParams.get("stockCode") ?? "";
  const keyword = (searchParams.get("keyword") ?? "").trim().toLowerCase();
  const favorite = searchParams.get("favorite") === "true";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);

  // 필터링
  const filtered = ALL_NEWS.filter((news) => {
    const matchesCategory = !category || news.category === category;
    // stockCode(종목코드 정확매칭)가 있으면 우선 적용, 없으면 사용자 검색어를 종목명/티커에 매칭
    const matchesStock = stockCode
      ? news.stockCode === stockCode
      : !keyword || news.stockName.toLowerCase().includes(keyword) || news.stockCode.toLowerCase().includes(keyword);
    const matchesFavorite = !favorite || favoriteStockCodes.has(news.stockCode);
    return matchesCategory && matchesStock && matchesFavorite;
  });

  // 페이지네이션
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    success: true, code: "OK", message: "조회 성공",
    data: { totalCount, totalPages, items },
  });
}
