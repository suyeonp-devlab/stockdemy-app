import { NextResponse } from "next/server";
import { isMarketOpen, round2, seedOf, seededRandom } from "@/app/api/stocks/_mock";

interface IndexBase {
  marketCode: string;
  marketName: string;
  baseValue: number;
  market: string; // isMarketOpen 판단 기준 (FX는 KRX/NASDAQ 중 하나라도 열려있으면 거래중으로 간주)
}

const INDEX_BASE: IndexBase[] = [
  { marketCode: "KOSPI", marketName: "코스피", baseValue: 2789.42, market: "KOSPI" },
  { marketCode: "KOSDAQ", marketName: "코스닥", baseValue: 845.13, market: "KOSDAQ" },
  { marketCode: "NASDAQ", marketName: "나스닥", baseValue: 21450.12, market: "NASDAQ" },
  { marketCode: "USDKRW", marketName: "원/달러", baseValue: 1382.5, market: "FX" },
];

// 실시간 지수/환율 값 계산 (장중이면 3초 단위로 변하는 결정적 난수, 장마감이면 고정)
function computeLiveValue(index: IndexBase): number {

  const seed = seedOf(index.marketCode);
  const isOpen = index.market === "FX" ? isMarketOpen("KOSPI") || isMarketOpen("NASDAQ") : isMarketOpen(index.market);

  if (!isOpen) {
    // 장마감 → 개장 이후 흐름을 반영한 값으로 고정 (요청마다 동일)
    const closeRandom = seededRandom(seed + 1);
    const drift = (closeRandom() - 0.47) * 0.02;
    return round2(index.baseValue * (1 + drift));
  }

  // 장중 → 3초 단위로 값이 바뀌는 결정적 난수 (폴링 시 실제로 변하는 것처럼 보이게)
  const bucket = Math.floor(Date.now() / 3000);
  const tickRandom = seededRandom(seed + bucket);
  const drift = (tickRandom() - 0.5) * 0.006;
  return round2(index.baseValue * (1 + drift));
}

// 지수/환율 mock (폴링 전용)
export async function GET() {

  const data = INDEX_BASE.map((index) => {
    const indexValue = computeLiveValue(index);
    const changePercent = round2(((indexValue - index.baseValue) / index.baseValue) * 100);
    return { marketCode: index.marketCode, marketName: index.marketName, indexValue, changePercent };
  });

  return NextResponse.json({ success: true, code: "OK", message: "조회 성공", data });
}
