import StockDetailPage from "@/features/stocks/StockDetailPage";

export default async function StockDetailRoutePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <StockDetailPage code={code} />;
}
