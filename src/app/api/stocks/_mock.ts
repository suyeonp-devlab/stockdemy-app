import { MinuteBar, PriceBar, Stock, StockFundamentals } from "@/features/stock/stock.type";
import { favoriteStockCodes } from "@/app/api/stocks/_store";

// 종목 코드 기준 결정적 시드
export function seedOf(text: string) {
  return text.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

// 시드 기반 결정적 난수 생성기
export function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export const round2 = (value: number) => Math.round(value * 100) / 100;

// 종목 기준 정보 (실시간으로 안 바뀌는 원천 데이터)
interface StockBase {
  stockCode: string;
  stockName: string;
  market: string;
  marketNm: string;
  sector: string;
  sectorNm: string;
  sentiment: string;
  sentimentNm: string;
  prevClose: number;
  week52High: number;
  week52Low: number;
  sharesOutstanding: number;
  foreignOwnership: number;
  eps: number;
  bps: number;
  annualDividend: number;
  sectorPer: number;
}

export const STOCK_BASE: Record<string, StockBase> = {
  "005930": {
    stockCode: "005930", stockName: "삼성전자", market: "KOSPI", marketNm: "코스피", sector: "ELECTRONICS", sectorNm: "전기전자",
    sentiment: "POSITIVE", sentimentNm: "긍정",
    prevClose: 73900, week52High: 88800, week52Low: 60600,
    sharesOutstanding: 5969782550, foreignOwnership: 51.2,
    eps: 5455, bps: 58900, annualDividend: 1590, sectorPer: 15.2,
  },
  "000660": {
    stockCode: "000660", stockName: "SK하이닉스", market: "KOSPI", marketNm: "코스피", sector: "ELECTRONICS", sectorNm: "전기전자",
    sentiment: "POSITIVE", sentimentNm: "긍정",
    prevClose: 176500, week52High: 210000, week52Low: 120000,
    sharesOutstanding: 728002365, foreignOwnership: 54.8,
    eps: 9918, bps: 70200, annualDividend: 1100, sectorPer: 15.2,
  },
  "035420": {
    stockCode: "035420", stockName: "NAVER", market: "KOSPI", marketNm: "코스피", sector: "SERVICE", sectorNm: "서비스업",
    sentiment: "NEUTRAL", sentimentNm: "중립",
    prevClose: 169400, week52High: 235000, week52Low: 150000,
    sharesOutstanding: 163636880, foreignOwnership: 48.5,
    eps: 7602, bps: 88400, annualDividend: 168, sectorPer: 24.6,
  },
  "035720": {
    stockCode: "035720", stockName: "카카오", market: "KOSPI", marketNm: "코스피", sector: "SERVICE", sectorNm: "서비스업",
    sentiment: "NEGATIVE", sentimentNm: "부정",
    prevClose: 38700, week52High: 62000, week52Low: 33500,
    sharesOutstanding: 445608645, foreignOwnership: 25.3,
    eps: 988, bps: 34700, annualDividend: 155, sectorPer: 24.6,
  },
  "373220": {
    stockCode: "373220", stockName: "LG에너지솔루션", market: "KOSPI", marketNm: "코스피", sector: "CHEMICAL", sectorNm: "화학",
    sentiment: "POSITIVE", sentimentNm: "긍정",
    prevClose: 318100, week52High: 452000, week52Low: 280000,
    sharesOutstanding: 234000000, foreignOwnership: 4.9,
    eps: 4692, bps: 103000, annualDividend: 640, sectorPer: 12.4,
  },
  "005380": {
    stockCode: "005380", stockName: "현대차", market: "KOSPI", marketNm: "코스피", sector: "TRANSPORT_EQUIPMENT", sectorNm: "운수장비",
    sentiment: "POSITIVE", sentimentNm: "긍정",
    prevClose: 215200, week52High: 285000, week52Low: 180000,
    sharesOutstanding: 209416191, foreignOwnership: 33.1,
    eps: 37586, bps: 311000, annualDividend: 10000, sectorPer: 7.1,
  },
  "068270": {
    stockCode: "068270", stockName: "셀트리온", market: "KOSDAQ", marketNm: "코스닥", sector: "PHARMACEUTICAL", sectorNm: "의약품",
    sentiment: "NEUTRAL", sentimentNm: "중립",
    prevClose: 179400, week52High: 210000, week52Low: 155000,
    sharesOutstanding: 218715214, foreignOwnership: 21.6,
    eps: 4321, bps: 47000, annualDividend: 0, sectorPer: 35.9,
  },
  "005490": {
    stockCode: "005490", stockName: "POSCO홀딩스", market: "KOSPI", marketNm: "코스피", sector: "STEEL_METAL", sectorNm: "철강금속",
    sentiment: "POSITIVE", sentimentNm: "긍정",
    prevClose: 309200, week52High: 495000, week52Low: 280000,
    sharesOutstanding: 84571230, foreignOwnership: 40.2,
    eps: 19873, bps: 624000, annualDividend: 10000, sectorPer: 11.8,
  },
  AAPL: {
    stockCode: "AAPL", stockName: "Apple", market: "NASDAQ", marketNm: "나스닥", sector: "ELECTRONICS", sectorNm: "전기전자",
    sentiment: "POSITIVE", sentimentNm: "긍정",
    prevClose: 187.8, week52High: 199.6, week52Low: 164.1,
    sharesOutstanding: 15700000000, foreignOwnership: 0,
    eps: 6.07, bps: 3.9, annualDividend: 0.96, sectorPer: 30.5,
  },
  NVDA: {
    stockCode: "NVDA", stockName: "NVIDIA", market: "NASDAQ", marketNm: "나스닥", sector: "ELECTRONICS", sectorNm: "전기전자",
    sentiment: "POSITIVE", sentimentNm: "긍정",
    prevClose: 855.7, week52High: 950.0, week52Low: 390.0,
    sharesOutstanding: 2460000000, foreignOwnership: 0,
    eps: 13.4, bps: 20.8, annualDividend: 0.16, sectorPer: 33.9,
  },
};

// 국내(KRX)/해외(NASDAQ) 정규장 운영 여부 (KST 기준)
export function isMarketOpen(market: string): boolean {

  const kstNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const day = kstNow.getDay();
  const minutes = kstNow.getHours() * 60 + kstNow.getMinutes();

  if (market === "NASDAQ") {
    // 나스닥 정규장 22:30~05:00 (KST, 서머타임 미반영 근사치) → 자정을 걸치는 구간
    return day !== 0 && day !== 6 && (minutes >= 22 * 60 + 30 || minutes < 5 * 60);
  }

  // KRX 정규장 평일 09:00~15:30
  return day !== 0 && day !== 6 && minutes >= 9 * 60 && minutes < 15 * 60 + 30;
}

// 실시간 현재가 계산 (장중이면 몇 초 단위로 변하는 결정적 난수, 장마감이면 종가 고정)
function computeLivePrice(code: string, base: StockBase): { price: number; open: number } {

  const seed = seedOf(code);
  const random = seededRandom(seed);
  const open = round2(base.prevClose * (1 + (random() - 0.5) * 0.01));

  if (!isMarketOpen(base.market)) {
    // 장마감 → 개장 이후 흐름을 반영한 종가로 고정 (요청마다 동일)
    const closeRandom = seededRandom(seed + 1);
    const drift = (closeRandom() - 0.47) * 0.03;
    return { price: round2(Math.max(open * (1 + drift), base.prevClose * 0.5)), open };
  }

  // 장중 → 3초 단위로 값이 바뀌는 결정적 난수 (폴링 시 실제로 변하는 것처럼 보이게)
  const bucket = Math.floor(Date.now() / 3000);
  const tickRandom = seededRandom(seed + bucket);
  const drift = (tickRandom() - 0.5) * 0.015;
  const price = round2(Math.max(open * (1 + drift), base.prevClose * 0.5));
  return { price, open };
}

// 오늘 봉(시가/고가/저가/종가/거래량/거래대금) 구성
function buildTodayBar(code: string, base: StockBase): PriceBar {

  const { price, open } = computeLivePrice(code, base);
  const seed = seedOf(code) + 2;
  const random = seededRandom(seed);

  const high = round2(Math.max(open, price) * (1 + random() * 0.008));
  const low = round2(Math.min(open, price) * (1 - random() * 0.008));
  const volume = Math.round(500000 + random() * 2000000);
  const tradingValue = Math.round(volume * ((open + high + low + price) / 4));

  return { date: new Date().toISOString().slice(0, 10), open, high, low, close: price, volume, tradingValue };
}

// 30일치 mock 일봉 (마지막 항목은 오늘 봉으로 교체)
export function buildPriceBars(code: string, days = 30): PriceBar[] {

  const base = STOCK_BASE[code];
  const seed = seedOf(code);
  const random = seededRandom(seed);

  let close = base.prevClose * (0.88 + random() * 0.08);
  const bars: PriceBar[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const open = close * (1 + (random() - 0.5) * 0.012);
    const drift = (random() - 0.47) * 0.035;
    const newClose = Math.max(open * (1 + drift), base.prevClose * 0.5);
    const high = Math.max(open, newClose) * (1 + random() * 0.012);
    const low = Math.min(open, newClose) * (1 - random() * 0.012);
    const volume = Math.round(500000 + random() * 2000000);
    const tradingValue = Math.round(volume * ((open + high + low + newClose) / 4));

    bars.push({
      date: date.toISOString().slice(0, 10),
      open: round2(open), high: round2(high), low: round2(low), close: round2(newClose),
      volume, tradingValue,
    });
    close = newClose;
  }

  bars.push(buildTodayBar(code, base));

  return bars;
}

// 오늘 하루치 mock 분봉 (장 시작~현재까지, 1분 간격)
export function buildMinuteBars(code: string): MinuteBar[] {

  const base = STOCK_BASE[code];
  const seed = seedOf(code) + 3;
  const random = seededRandom(seed);

  const kstNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const marketOpenMinutes = base.market === "NASDAQ" ? 22 * 60 + 30 : 9 * 60;
  const nowMinutes = kstNow.getHours() * 60 + kstNow.getMinutes();

  // 개장 전(00:00~개장 시각)에는 아직 오늘 분봉이 없으므로, 최근 완료된 하루치(전일 세션)를 대신 보여줌
  const beforeOpenToday = nowMinutes < marketOpenMinutes;
  const elapsed = Math.max(1, beforeOpenToday ? 390 : Math.min(390, nowMinutes - marketOpenMinutes));

  const sessionDate = new Date(kstNow);
  if (beforeOpenToday) sessionDate.setDate(sessionDate.getDate() - 1);

  let close = base.prevClose * (1 + (random() - 0.5) * 0.01);
  const bars: MinuteBar[] = [];

  for (let i = 0; i < elapsed; i++) {
    const time = new Date(sessionDate);
    time.setHours(Math.floor(marketOpenMinutes / 60), marketOpenMinutes % 60 + i, 0, 0);

    const open = close;
    const drift = (random() - 0.5) * 0.003;
    const newClose = Math.max(open * (1 + drift), base.prevClose * 0.5);
    const high = Math.max(open, newClose) * (1 + random() * 0.002);
    const low = Math.min(open, newClose) * (1 - random() * 0.002);
    const volume = Math.round(2000 + random() * 15000);
    const tradingValue = Math.round(volume * ((open + high + low + newClose) / 4));

    bars.push({
      date: `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, "0")}-${String(time.getDate()).padStart(2, "0")}`,
      time: `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`,
      open: round2(open), high: round2(high), low: round2(low), close: round2(newClose),
      volume, tradingValue,
    });
    close = newClose;
  }

  // 마지막 분봉은 실시간 현재가로 맞춤
  if (bars.length > 0) {
    const { price } = computeLivePrice(code, base);
    const last = bars[bars.length - 1];
    last.close = price;
    last.high = Math.max(last.high, price);
    last.low = Math.min(last.low, price);
  }

  return bars;
}

// 종목 목록/실시간용 Stock 조회
export function buildStock(code: string): Stock | null {

  const base = STOCK_BASE[code];
  if (!base) return null;

  const { price } = computeLivePrice(code, base);
  const changePercent = round2(((price - base.prevClose) / base.prevClose) * 100);
  const marketCap = Math.round(price * base.sharesOutstanding);

  return {
    stockCode: base.stockCode, stockName: base.stockName,
    market: base.market, marketNm: base.marketNm,
    sector: base.sector, sectorNm: base.sectorNm,
    price, changePercent, marketCap,
    sentiment: base.sentiment, sentimentNm: base.sentimentNm,
    favorite: favoriteStockCodes.has(code),
  };
}

// 종목 펀더멘털 조회
export function buildFundamentals(code: string): StockFundamentals | null {

  const base = STOCK_BASE[code];
  if (!base) return null;

  return {
    stockCode: base.stockCode, stockName: base.stockName,
    market: base.market, marketNm: base.marketNm,
    sector: base.sector, sectorNm: base.sectorNm,
    sentiment: base.sentiment, sentimentNm: base.sentimentNm,
    favorite: favoriteStockCodes.has(code),
    prevClose: base.prevClose,
    week52High: base.week52High, week52Low: base.week52Low,
    sharesOutstanding: base.sharesOutstanding, foreignOwnership: base.foreignOwnership,
    eps: base.eps, bps: base.bps, annualDividend: base.annualDividend,
    sectorPer: base.sectorPer,
    aiComment: "ai추천 문구 테스트 ai추천 문구 테스트 ai추천 문구 테스트 ai추천 문구 테스트 ai추천 문구 테스트 ai추천 문구 테스트 ai추천 문구 테스트"
  };
}

// 실시간 시세(TodayQuote) 조회 (폴링 전용 경량 응답)
export function buildTodayQuote(code: string) {

  const base = STOCK_BASE[code];
  if (!base) return null;

  const todayBar = buildTodayBar(code, base);
  const changePercent = round2(((todayBar.close - base.prevClose) / base.prevClose) * 100);
  const minuteBars = buildMinuteBars(code);
  const latestMinuteBar = minuteBars[minuteBars.length - 1] ?? {
    date: todayBar.date, time: "09:00",
    open: todayBar.open, high: todayBar.open, low: todayBar.open, close: todayBar.open, volume: 0, tradingValue: 0,
  };

  return {
    price: todayBar.close,
    changePercent,
    todayBar,
    latestMinuteBar,
    isMarketOpen: isMarketOpen(base.market),
    updatedAt: new Date().toISOString(),
  };
}
