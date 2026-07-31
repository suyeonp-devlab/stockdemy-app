import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getStockFundamentalsServer } from "@/features/stock/stock.api.server";
import StockDetailPage from "@/features/stock/StockDetailPage";
import { getQueryClient } from "@/shared/lib/query-client";
import { STOCK_QUERY_KEYS } from "@/features/stock/stock.query";
import NotFoundFeedback from "@/shared/components/feedback/NotFoundFeedback";

interface StockDetailRouteProps {
  params: Promise<{ code: string }>;
}

// SEO 메타태그 생성
export async function generateMetadata({ params }: StockDetailRouteProps): Promise<Metadata> {

  const { code } = await params;

  const stock = await getStockFundamentalsServer(code);
  if (!stock) return { title: "종목 상세" };

  const title = `${stock.stockName}(${stock.stockCode})`;
  const description = `${title} 종목의 실시간 시세와 AI 분석을 확인해보세요.`;

  return {
    title,
    description,
    openGraph: { title: title, description, type: "website" },
  };
}

export default async function StockDetailRoutePage({ params }: StockDetailRouteProps) {

  const { code } = await params;

  const stock = await getStockFundamentalsServer(code);
  if (!stock) return <NotFoundFeedback text="종목 검색으로 이동" href="/stock" className="h-[calc(100vh-170px)] md:h-[calc(100vh-160px)]" />

  // Query hydration
  const queryClient = getQueryClient();
  queryClient.setQueryData(STOCK_QUERY_KEYS.detail(code), stock);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StockDetailPage stockCode={code} />
    </HydrationBoundary>
  );
}
