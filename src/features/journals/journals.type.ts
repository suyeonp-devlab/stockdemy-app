import { Market } from "@/features/stocks/stocks.type";

// 매매 유형
export type TradeType = "BUY" | "SELL";

// 주식 일지 항목
export interface JournalEntry {
  id: string;
  stockCode: string;
  stockName: string;
  market: Market;
  tradeType: TradeType;
  tradeDate: string;
  price: number;
  quantity: number;
  memo: string;
  aiComment: string | null;
  createdAt: string;
}

// 일지 작성 요청
export interface CreateJournalPayload {
  stockCode: string;
  stockName: string;
  market: Market;
  tradeType: TradeType;
  tradeDate: string;
  price: number;
  quantity: number;
  memo: string;
}
