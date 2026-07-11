"use client";

import { useEffect, useRef } from "react";
import { CandlestickSeries, createChart, HistogramSeries, IChartApi, LineSeries } from "lightweight-charts";
import { PriceBar } from "@/features/stocks/stocks.type";

interface PriceChartProps {
  data: PriceBar[];
}

// 이동평균선 계산
function computeMovingAverage(bars: PriceBar[], period: number) {
  return bars
    .map((bar, index) => {
      if (index < period - 1) return null;
      const slice = bars.slice(index - period + 1, index + 1);
      const avg = slice.reduce((sum, b) => sum + b.close, 0) / period;
      return { time: bar.time, value: Math.round(avg * 100) / 100 };
    })
    .filter((point): point is { time: string; value: number } => point !== null);
}

export default function PriceChart({ data }: PriceChartProps) {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart: IChartApi = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: { background: { color: "transparent" }, textColor: "#9ca3af" },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      timeScale: { borderColor: "#1f2937" },
      rightPriceScale: { borderColor: "#1f2937" },
      crosshair: { mode: 0 },
    });

    // 캔들스틱 (메인 패널)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#f87171", downColor: "#38bdf8",
      borderUpColor: "#f87171", borderDownColor: "#38bdf8",
      wickUpColor: "#f87171", wickDownColor: "#38bdf8",
      priceScaleId: "right",
    });
    candleSeries.priceScale().applyOptions({ scaleMargins: { top: 0.05, bottom: 0.3 } });
    candleSeries.setData(data.map((bar) => ({ time: bar.time, open: bar.open, high: bar.high, low: bar.low, close: bar.close })));

    // 이동평균선 5일 / 20일
    const ma5Series = chart.addSeries(LineSeries, { color: "#facc15", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    ma5Series.setData(computeMovingAverage(data, 5));

    const ma20Series = chart.addSeries(LineSeries, { color: "#a78bfa", lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    ma20Series.setData(computeMovingAverage(data, 20));

    // 거래량 히스토그램 (하단 별도 영역)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.75, bottom: 0 } });
    volumeSeries.setData(
      data.map((bar) => ({ time: bar.time, value: bar.volume, color: bar.close >= bar.open ? "#f8717166" : "#38bdf866" }))
    );

    chart.timeScale().fitContent();

    // 컨테이너 크기 변화를 직접 감지해서 차트 리사이즈 (autoSize 대신 명시적 처리)
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.resize(width, height);
      chart.timeScale().fitContent();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-[280px] md:h-[420px]" />;
}
