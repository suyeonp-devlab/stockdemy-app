import { ChartBar, MinuteBar, PriceBar, StockRequest, StockURLSearchParams, TabMode } from "@/features/stock/stock.type";
import { useAuthStore } from "@/shared/store/auth.store";
import { LineData, Time } from "lightweight-charts";
import { toEpochSeconds } from "@/shared/utils/date-time";

// 탭 유형 검사
export const isTabMode = (value: string | undefined): value is TabMode => {
  return value === "topVolume" || value === "market" || value === "sector" || value === "favorite";
}

// url 쿼리 파라미터 포맷 (쿼리 파라미터 → 종목 request)
export const formatStockSearchParams = (
  params: StockURLSearchParams, pageSize: number
): StockRequest => {

  const { tab, market = "", sector = "", keyword = "", page } = params;

  let currentTab = isTabMode(tab) ? tab : "topVolume";

  // 비로그인 상태 → 관심종목 탭 사용 불가
  const isLoggedIn = useAuthStore.getState().isLoggedIn;
  if (currentTab === "favorite" && !isLoggedIn) currentTab = "topVolume";

  return {
    market: currentTab === "market" ? market : "",
    sector: currentTab === "sector" ? sector : "",
    keyword: keyword.trim(),
    favorite: currentTab === "favorite",
    topVolume: currentTab === "topVolume",
    page: Math.max(1, Number(page) || 1),
    pageSize,
  };
}

// url 쿼리 파라미터 생성
export const buildStockSearchParams = (params: StockURLSearchParams): string => {

  const query = new URLSearchParams();

  const normalizedTab = isTabMode(params.tab) ? params.tab : "topVolume";
  query.set("tab", normalizedTab);

  if (normalizedTab === "market" && params.market) query.set("market", params.market);
  if (normalizedTab === "sector" && params.sector) query.set("sector", params.sector);
  if (params.keyword) query.set("keyword", params.keyword);
  if (normalizedTab !== "topVolume" && params.page) query.set("page", params.page);

  return query.toString();
};

// 차트용 시세 형식으로 변환
export const toChartBar = (bar: PriceBar | MinuteBar): ChartBar => ({
  time: "time" in bar ? toEpochSeconds(bar.date, bar.time) : bar.date,
  open: bar.open,
  high: bar.high,
  low: bar.low,
  close: bar.close,
  volume: bar.volume,
});

// 이동평균선 계산
export const computeMovingAverage = (bars: ChartBar[], period: number): LineData[] => {

  const points: (LineData | null)[] = bars.map((bar, index) => {

    if (index < period - 1) return null;

    const slice = bars.slice(index - period + 1, index + 1);
    const average = slice.reduce((sum, current) => sum + current.close, 0) / period;
    const value = Math.round(average * 100) / 100;

    return { time: bar.time as Time, value };
  });

  return points.filter(point => point !== null);
};