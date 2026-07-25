import { StockFundamentals } from "@/features/stock/stock.type";
import { ApiResponse } from "@/shared/types/api.type";

// 종목 기초데이터 조회 (서버 컴포넌트 전용)
export const getStockFundamentalsServer = async (stockCode: string): Promise<StockFundamentals | null> => {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stocks/${stockCode}/fundamentals`, { next: { revalidate: 300 } });
  if (!response.ok) return null;

  const body: ApiResponse<StockFundamentals> = await response.json();
  return body.data;
};
