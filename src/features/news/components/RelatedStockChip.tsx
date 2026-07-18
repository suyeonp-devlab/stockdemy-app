import { NewsRelatedStock } from "@/features/news/news.type";
import Link from "next/link";
import clsx from "clsx";

interface RelatedStockChipProps {
  stock: NewsRelatedStock;
}

export default function RelatedStockChip({ stock }: RelatedStockChipProps) {

  return (
    <Link
      href={`/stock/${stock.stockCode}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm rounded-full bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors"
    >
      <span className="text-gray-100">{stock.stockName}</span>
      <span className={clsx("text-xs", impactStyles[stock.impact])}>{stock.impactNm}</span>
    </Link>
  );
}

// 관련 종목 영향에 따른 스타일
const impactStyles: Record<string, string> = {
  BENEFIT: "text-red-400",
  LIMITED: "text-gray-400",
  ADVERSE: "text-sky-400",
};