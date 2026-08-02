// 주식 일지
export interface Journal {
  id: string;
  stockCode: string;
  stockName: string;
  status: string;
  statusNm: string;
  market: string;
  marketNm: string;
  tradeType: string;
  tradeTypeNm: string;
  tradeDate: string;
  tradeTime: string | null;
  price: number;
  quantity: number;
  memo: string | null;
  aiComment: string | null;
  createdAt: string;
}

// 주식 일지 작성 request
export interface CreateJournalRequest {
  stockCode: string;
  stockName: string;
  market: string;
  tradeType: string;
  tradeDate: string;
  tradeTime: string | null;
  price: number;
  quantity: number;
  memo: string;
}

// 주식 일지 수정 request
export type UpdateJournalRequest = CreateJournalRequest & { id: string; };