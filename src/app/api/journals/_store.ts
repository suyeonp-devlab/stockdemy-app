import { CreateJournalRequest, Journal } from "@/features/journal/journal.type";

// 거래 유형 코드명
export const TRADE_TYPE_NM: Record<string, string> = { BUY: "매수", SELL: "매도" };

// 시장 코드명
export const MARKET_NM: Record<string, string> = { KOSPI: "KOSPI", KOSDAQ: "KOSDAQ", NASDAQ: "NASDAQ" };

// 주식일지 상태 코드명
export const STATUS_NM: Record<string, string> = { STANDBY: "분석 대기", PENDING: "AI 분석 중", DONE: "AI 분석 완료" };

// 작성/수정 request → 코드명 필드 계산
const toCodeFields = (payload: CreateJournalRequest) => ({
  marketNm: MARKET_NM[payload.market] ?? payload.market,
  tradeTypeNm: TRADE_TYPE_NM[payload.tradeType] ?? payload.tradeType,
});

// 주식 일지 mock 저장소 (서버 프로세스가 살아있는 동안 유지되는 in-memory store)
export const journalStore: Journal[] = [
  {
    id: "1", stockCode: "NVDA", stockName: "NVIDIA", market: "NASDAQ", marketNm: MARKET_NM.NASDAQ,
    status: "DONE", statusNm: STATUS_NM.DONE, sector: "TEST", sectorNm: "철도업",
    tradeType: "BUY", tradeTypeNm: TRADE_TYPE_NM.BUY, tradeDate: "2026-06-10", tradeTime: null, price: 875.4, quantity: 5,
    memo: "엔비디아 블랙웰 수요 강세 뉴스 보고 진입. GTC 2026 발표 앞두고 선매수.",
    aiComment: "매수 시점인 6월 10일은 엔비디아 Blackwell 수요 관련 긍정적 애널리스트 리포트가 집중된 시기로, 시장 센티먼트가 강세였습니다. GTC 이벤트를 앞둔 기대감이 반영된 진입으로, 단기 모멘텀 관점에서는 적절한 판단으로 보입니다.",
    createdAt: "2026-06-10T09:00:00.000Z",
  },
  {
    id: "2", stockCode: "005930", stockName: "삼성전자", market: "KOSPI", marketNm: MARKET_NM.KOSPI,
    status: "PENDING", statusNm: STATUS_NM.PENDING, sector: "TEST", sectorNm: "철도업",
    tradeType: "SELL", tradeTypeNm: TRADE_TYPE_NM.SELL, tradeDate: "2026-06-05", tradeTime: "10:32:00", price: 75400, quantity: 10,
    memo: "반도체 업황 불확실성으로 일부 익절. HBM 관련 뉴스 모니터링 중.",
    aiComment: null,
    createdAt: "2026-06-05T09:00:00.000Z",
  },
  {
    id: "3", stockCode: "000660", stockName: "SK하이닉스", market: "KOSPI", marketNm: MARKET_NM.KOSPI,
    status: "DONE", statusNm: STATUS_NM.DONE, sector: "TEST", sectorNm: "철도업",
    tradeType: "BUY", tradeTypeNm: TRADE_TYPE_NM.BUY, tradeDate: "2026-05-28", tradeTime: null, price: 182500, quantity: 3,
    memo: "HBM4 공급 계약 소식 직후 진입. 엔비디아향 물량 확대 기대.",
    aiComment: "5월 28일 HBM4 관련 뉴스 발표 직후 진입은 모멘텀 관점에서 유효했습니다. 다만 당시 외국인 순매도 흐름이 병행되어 단기 변동성이 높았던 구간임을 참고하세요.",
    createdAt: "2026-05-28T09:00:00.000Z",
  },
  {
    id: "6", stockCode: "005930", stockName: "삼성전자", market: "KOSPI", marketNm: MARKET_NM.KOSPI,
    status: "STANDBY", statusNm: STATUS_NM.STANDBY, sector: "TEST", sectorNm: "철도업",
    tradeType: "BUY", tradeTypeNm: TRADE_TYPE_NM.BUY, tradeDate: "2026-05-20", tradeTime: null, price: 68000, quantity: 10,
    memo: "실적 기대감으로 매수.",
    aiComment: null,
    createdAt: "2026-05-20T09:00:00.000Z",
  },
  {
    id: "4", stockCode: "035720", stockName: "카카오", market: "KOSPI", marketNm: MARKET_NM.KOSPI,
    status: "STANDBY", statusNm: STATUS_NM.STANDBY, sector: "TEST", sectorNm: "철도업",
    tradeType: "SELL", tradeTypeNm: TRADE_TYPE_NM.SELL, tradeDate: "2026-05-15", tradeTime: null, price: 38250, quantity: 20,
    memo: "규제 이슈로 손절. 더 빠질 것 같아 매도 결정.",
    aiComment: null,
    createdAt: "2026-05-15T09:00:00.000Z",
  },
  {
    id: "5", stockCode: "AAPL", stockName: "Apple", market: "NASDAQ", marketNm: MARKET_NM.NASDAQ,
    status: "DONE", statusNm: STATUS_NM.DONE, sector: "TEST", sectorNm: "철도업",
    tradeType: "BUY", tradeTypeNm: TRADE_TYPE_NM.BUY, tradeDate: "2026-04-22", tradeTime: null, price: 189.3, quantity: 2,
    memo: "Apple Intelligence 업데이트 기대감으로 매수. 실적발표 전 진입.",
    aiComment: "4월 22일 진입 시점은 Apple Intelligence 기능 확장 발표 직전으로 기대감이 선반영된 구간이었습니다. 실적 발표 후 가이던스 실망으로 조정이 있었으나, 장기 보유 관점에서는 의미 있는 구간에서의 분할 매수로 판단됩니다.",
    createdAt: "2026-04-22T09:00:00.000Z",
  },
  {
    id: "7", stockCode: "035720", stockName: "카카오", market: "KOSPI", marketNm: MARKET_NM.KOSPI,
    status: "STANDBY", statusNm: STATUS_NM.STANDBY, sector: "TEST", sectorNm: "철도업",
    tradeType: "BUY", tradeTypeNm: TRADE_TYPE_NM.BUY, tradeDate: "2026-04-10", tradeTime: null, price: 41000, quantity: 20,
    memo: "저점 매수 시도.",
    aiComment: null,
    createdAt: "2026-04-10T09:00:00.000Z",
  },
];

let nextId = 8;

export const generateJournalId = () => String(nextId++);

export const addJournal = (entry: Journal) => {
  journalStore.unshift(entry);
};

export const findJournalById = (id: string) => journalStore.find((entry) => entry.id === id);

// 주식 일지 작성 request → Journal 저장 항목 생성
export const buildJournal = (payload: CreateJournalRequest): Journal => ({
  id: generateJournalId(),
  ...payload,
  ...toCodeFields(payload),
  status: "STANDBY",
  statusNm: STATUS_NM.STANDBY,
  sector: "TEST",
  sectorNm: "철도업",
  aiComment: null,
  createdAt: new Date().toISOString(),
});

// 주식 일지 수정 (분석 대기 건만 수정 가능 — 분석 중/완료 건은 수정 불가)
export const updateJournalById = (id: string, payload: CreateJournalRequest) => {

  const entry = findJournalById(id);
  if (!entry || entry.status !== "STANDBY") return null;

  Object.assign(entry, payload, toCodeFields(payload));
  return entry;
};
