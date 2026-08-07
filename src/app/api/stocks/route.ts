import { NextRequest, NextResponse } from "next/server";
import { buildStock, STOCK_BASE } from "@/app/api/stocks/_mock";

// 종목 코드 기준 결정적 mock 거래량 (거래량 상위 정렬용)
function mockVolume(code: string) {
  const seed = code.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (seed * 9301 + 49297) % 20000000;
}

// 종목 목록 mock (시장/업종/종목명/관심종목/거래량 상위 필터 + 페이지네이션)
export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") || "all";
  const sector = searchParams.get("sector") ?? "";
  const keyword = (searchParams.get("keyword") ?? "").trim().toLowerCase();
  const favorite = searchParams.get("favorite") === "true";
  const topVolume = searchParams.get("topVolume") === "true";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);

  const allStocks = Object.keys(STOCK_BASE)
    .map((code) => buildStock(code)!)
    .filter(Boolean);

  // 종목명/티커 검색어 매칭 (모든 탭 공통 적용)
  const matchesKeyword = (stock: { stockName: string; stockCode: string }) => !keyword
    || stock.stockName.toLowerCase().includes(keyword)
    || stock.stockCode.toLowerCase().includes(keyword);

  // 필터링 (관심종목 조회는 favorite + keyword, 거래량 상위는 keyword만 적용)
  const filtered = favorite
    ? allStocks.filter((stock) => stock.favorite && matchesKeyword(stock))
    : topVolume
      ? allStocks.filter((stock) => matchesKeyword(stock))
      : allStocks.filter((stock) => {
          const matchesMarket = market === "all" || stock.market === market;
          const matchesSector = !sector || stock.sector === sector;
          return matchesMarket && matchesSector && matchesKeyword(stock);
        });

  // 정렬 (거래량 상위 → mock 거래량 내림차순, 그 외 → 시가총액 내림차순)
  const sorted = [...filtered].sort((a, b) => topVolume
    ? mockVolume(b.stockCode) - mockVolume(a.stockCode)
    : b.marketCap - a.marketCap);

  // 페이지네이션
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize;
  const items = sorted.slice(start, start + pageSize);

  return NextResponse.json({
    success: true, code: "OK", message: "조회 성공",
    data: { totalCount, totalPages, items },
  });
}
