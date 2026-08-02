import { useEffect, useMemo, useRef, useState } from "react";
import { Stock } from "@/features/stock/stock.type";
import { useGetStockQuotesQuery } from "@/features/stock/stock.query";

// 배경색 깜빡임 지속시간 (ms)
const FLASH_DURATION = 1000;

export type FlashDirection = "up" | "down";

/**
 * 종목 목록의 실시간 시세 폴링 병합 + 가격변경 깜빡임 효과 대상 반환
 * @example const { mergedStockList, flashDirections } = useStockLiveQuotes();
 */
export function useStockLiveQuotes(stockList: Stock[]) {

  const stockCodes = useMemo(() => stockList.map((stock) => stock.stockCode), [stockList]);
  const { data: quotes = [] } = useGetStockQuotesQuery(stockCodes);

  // 폴링된 시세를 목록에 병합
  const mergedStockList = useMemo(() => {

    if (quotes.length === 0) return stockList;

    const quoteMap = new Map(quotes.map((quote) => [quote.stockCode, quote]));

    return stockList.map((stock) => {
      const quote = quoteMap.get(stock.stockCode);
      return quote ? { ...stock, price: quote.price, changePercent: quote.changePercent, marketCap: quote.marketCap } : stock;
    });
  }, [stockList, quotes]);

  // 가격 변경 시 배경색 깜빡임 효과 대상 추적
  const prevPricesRef = useRef<Map<string, number>>(new Map());
  const [flashDirections, setFlashDirections] = useState<Map<string, FlashDirection>>(new Map());

  useEffect(() => {

    const prevPrices = prevPricesRef.current;
    const nextPrices = new Map<string, number>();
    const nextFlashDirections = new Map<string, FlashDirection>();

    mergedStockList.forEach((stock) => {
      const prevPrice = prevPrices.get(stock.stockCode);
      if (prevPrice !== undefined && prevPrice !== stock.price) {
        nextFlashDirections.set(stock.stockCode, stock.price > prevPrice ? "up" : "down");
      }
      nextPrices.set(stock.stockCode, stock.price);
    });

    prevPricesRef.current = nextPrices;
    if (nextFlashDirections.size === 0) return;

    setFlashDirections(nextFlashDirections);
    const timer = setTimeout(() => setFlashDirections(new Map()), FLASH_DURATION);
    return () => clearTimeout(timer);
  }, [mergedStockList]);

  return { mergedStockList, flashDirections };
}
