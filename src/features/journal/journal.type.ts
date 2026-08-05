// 주식 일지 request
export interface JournalRequest {
  status: string;
  page: number;
  pageSize: number;
}

// 주식 일지 response
export interface JournalResponse {
  totalCount: number;
  totalPages: number;
  items: Journal[];
}

// 주식 일지 항목
export interface Journal {
  id: string;
  stockCode: string;
  stockName: string;
  status: string;
  statusNm: string;
  market: string;
  marketNm: string;
  sector: string;
  sectorNm: string;
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
  sector: string;
  tradeType: string;
  tradeDate: string;
  tradeTime: string | null;
  price: number;
  quantity: number;
  memo: string;
}

// 주식 일지 수정 request
export type UpdateJournalRequest = CreateJournalRequest & { id: string; };