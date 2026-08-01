import clsx from "clsx";
import { MarketIndex } from "@/features/dashboard/dashboard.type";
import { formatNumber } from "@/shared/utils/number";

interface MarketTickerRowProps {
  index: MarketIndex;
  className?: string;
}

export default function MarketTickerRow({ index, className }: MarketTickerRowProps) {

  const isUp = index.changePercent >= 0;

  return (
    <div className={clsx("flex items-center gap-2 whitespace-nowrap flex-shrink-0", className)}>
      <span className="text-sm font-medium text-gray-400">{index.marketName}</span>
      <span className="text-sm font-semibold text-gray-100">{formatNumber(index.indexValue)}</span>
      <span className={`text-sm font-medium tabular-nums ${isUp ? "text-red-400" : "text-sky-400"}`}>
        {isUp ? "▲" : "▼"} {Math.abs(index.changePercent)}%
      </span>
    </div>
  );
}