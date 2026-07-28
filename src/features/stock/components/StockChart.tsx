"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CandlestickData,
  CandlestickSeries,
  createChart,
  HistogramData,
  HistogramSeries,
  IChartApi,
  LineSeries,
  Time,
  TrackingModeExitMode
} from "lightweight-charts";
import { TodayQuote } from "@/features/stock/stock.type";
import clsx from "clsx";
import { useGetMinuteBarListQuery, useGetPriceBarListQuery } from "@/features/stock/stock.query";
import { computeMovingAverage, toChartBar } from "@/features/stock/stock.lib";
import { formatNumber } from "@/shared/utils/number";
import StockChartSkeleton from "@/features/stock/skeleton/StockChartSkeleton";
import { formatDate } from "@/shared/utils/date-time";
import AiCommentCard from "@/features/stock/components/AiCommentCard";

type ChartType = "DAY" | "MINUTE";

interface StockChartProps {
  stockCode: string;
  todayQuote: TodayQuote;
  aiComment?: string | null;
}

export default function StockChart({
  stockCode,
  todayQuote,
  aiComment
}: StockChartProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 선택한 차트 유형
  const [chartType, setChartType] = useState<ChartType>("DAY");

  const { data: priceBars = [], isLoading: isPriceBarsLoading } = useGetPriceBarListQuery(chartType === "DAY" ? stockCode : null);
  const { data: minuteBars = [], isLoading: isMinuteBarsLoading } = useGetMinuteBarListQuery(chartType === "MINUTE" ? stockCode : null);

  const isLoading = chartType === "DAY" ? isPriceBarsLoading : isMinuteBarsLoading;

  const chartData = useMemo(
    () => chartType === "DAY" ? priceBars.map(toChartBar) : minuteBars.map(toChartBar),
    [chartType, priceBars, minuteBars]
  );

  // 차트 렌더링
  useEffect(() => {

    if (!containerRef.current) return;

    // 1. 차트 생성 및 기본 옵션 설정
    const chart: IChartApi = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: { background: { color: "transparent" }, textColor: "#9ca3af" },
      grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
      // x축/크로스헤어 (분봉은 시:분, 일봉은 날짜)
      timeScale: { borderColor: "#1f2937", timeVisible: chartType === "MINUTE", secondsVisible: false },
      rightPriceScale: { borderColor: "#1f2937" },
      // Y축 라벨은 커서 옆 툴팁으로 대체 & X축 라벨은 파란색 배경으로 강조
      crosshair: { mode: 0, horzLine: { labelVisible: false }, vertLine: { color: "#3b82f680" } },
      // 모바일에서 길게 누른 뒤에도 크로스헤어와 툴팁 유지
      trackingMode: { exitMode: TrackingModeExitMode.OnNextTap },
    });

    // 2. 캔들스틱 시리즈 생성 및 시세 데이터 설정
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#f87171", downColor: "#38bdf8", borderUpColor: "#f87171", borderDownColor: "#38bdf8",
      wickUpColor: "#f87171", wickDownColor: "#38bdf8", priceScaleId: "right",
    });

    candleSeries.priceScale().applyOptions({ scaleMargins: { top: 0.05, bottom: 0.3 } });
    candleSeries.setData(chartData.map(data => ({ ...data, time: data.time as Time })));

    // 3. 이동평균선 시리즈 생성 (일봉에서만 표시)
    if (chartType === "DAY") {
      MOVING_AVERAGES.forEach(({ period, color }) => {
        const maSeries = chart.addSeries(LineSeries, { color, lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
        maSeries.setData(computeMovingAverage(chartData, period));
      });
    }

    // 4. 거래량 히스토그램 시리즈 생성
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" }, priceScaleId: "volume",
    });

    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.75, bottom: 0 } });
    volumeSeries.setData(
      chartData.map((bar) => ({ time: bar.time as Time, value: bar.volume, color: bar.close >= bar.open ? "#f8717166" : "#38bdf866" }))
    );

    // 5. 크로스헤어 위치에 따라 툴팁 표시
    chart.subscribeCrosshairMove((param) => {

      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      if (!tooltip || !container) return;
      
      const candle = param.point && param.seriesData.get(candleSeries) as CandlestickData | undefined;
      
      if (!param.point || !candle || param.point.x < 0 || param.point.y < 0) {
        tooltip.style.display = "none";
        return;
      }

      const volume = (param.seriesData.get(volumeSeries) as HistogramData | undefined)?.value;
      const isUp = candle.close >= candle.open;

      tooltip.innerHTML = `
        <div class="chart-tooltip-row"><span class="label">시가</span><b>${formatNumber(candle.open)}</b></div>
        <div class="chart-tooltip-row"><span class="label">고가</span><b>${formatNumber(candle.high)}</b></div>
        <div class="chart-tooltip-row"><span class="label">저가</span><b>${formatNumber(candle.low)}</b></div>
        <div class="chart-tooltip-row" style="color:${isUp ? "#f87171" : "#38bdf8"}"><span class="label">종가</span><b>${formatNumber(candle.close)}</b></div>
        ${volume !== undefined ? `<div class="chart-tooltip-row"><span class="label">거래량</span><b>${formatNumber(volume)}</b></div>` : ""}
      `;

      // 커서 우측 위로 배치 (컨테이너 밖으로 넘치면 반대쪽으로 배치)
      const offset = 12;
      let left = param.point.x + offset;
      let top = param.point.y - tooltip.offsetHeight - offset;
      if (left + tooltip.offsetWidth > container.clientWidth) left = param.point.x - tooltip.offsetWidth - offset;
      if (top < 0) top = param.point.y + offset;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.style.display = "block";
    });

    // 6. 데이터 범위에 맞게 시간축 조정
    chart.timeScale().fitContent();

    // 7. 컨테이너 크기 변경 시 차트 크기 동기화
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.resize(width, height);
      chart.timeScale().fitContent();
    });
    
    resizeObserver.observe(containerRef.current);

    // 8. 차트 및 리소스 정리
    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [chartData, chartType]);

  // 조회중
  if (isLoading) return <StockChartSkeleton />

  return (
    <div className="flex flex-col">
      {/* 차트 상단 */}
      <div className="mb-4 ml-auto pr-1">
        <div className="flex items-center gap-3 md:gap-5">
          <span className="text-xs md:text-sm text-gray-500">
            {todayQuote.isMarketOpen ? "실시간" : "장마감"} · {formatDate(todayQuote.updatedAt, "HH:mm")} 기준
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setChartType("DAY")}
              className={clsx("px-3 py-1 text-xs md:text-sm font-medium rounded-sm transition-colors", chartType === "DAY" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-500 hover:text-gray-300")}
            >
              일봉
            </button>
            <button
              onClick={() => setChartType("MINUTE")}
              className={clsx("px-3 py-1 text-xs md:text-sm font-medium rounded-sm transition-colors", chartType === "MINUTE" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-500 hover:text-gray-300")}
            >
              분봉
            </button>
          </div>
        </div>
      </div>

      {/* 차트 내용 */}
      <div className="bg-gray-900 rounded-md p-4 pr-2">
        <div className="relative w-full h-[280px] md:h-[420px]">
          {chartType === "DAY" && (
            <div className="absolute top-0 left-0 md:left-2 z-10 flex items-center gap-3">
              {MOVING_AVERAGES.map(({ period, color }) => (
                <span key={period} className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  {period}
                </span>
              ))}
            </div>
          )}

          <div ref={containerRef} className="w-full h-full" />

          <div
            ref={tooltipRef}
            style={{ display: "none" }}
            className="absolute z-20 pointer-events-none whitespace-nowrap rounded-md border border-gray-700 bg-gray-950/95 px-2.5 py-2 text-xs text-gray-300 shadow-lg space-y-0.5"
          />
        </div>
      </div>

      {/* AI 코멘트 */}
      {aiComment && <AiCommentCard aiComment={aiComment} />}
    </div>
  );
}

// 이동평균선 종류
const MOVING_AVERAGES = [
  { period: 5, color: "#facc15" },
  { period: 20, color: "#a78bfa" },
  { period: 60, color: "#4ade80" },
  { period: 120, color: "#fb923c" },
];



