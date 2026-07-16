import clsx from "clsx";
import { News } from "@/features/news/news.type";

const sentimentBadgeStyle: Record<string, string> = {
  POSITIVE: "bg-red-950 text-red-300",
  NEUTRAL: "bg-gray-800 text-gray-400",
  NEGATIVE: "bg-sky-950 text-sky-300",
};

// 뉴스 목록 항목
export default function NewsCard({ item }: { item: News }) {
  return (
    <div className="py-5 px-3 -mx-3 hover:bg-gray-900/50 rounded-xl transition-colors cursor-pointer">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
          {item.stockName.slice(0, 1)}
        </div>
        <span className="text-xs text-gray-400">{item.stockName}</span>
        <span className="text-xs text-gray-600">·</span>
        <span className="text-xs text-gray-600">{item.publishedAt}</span>
        <span className={clsx("px-2 py-0.5 text-xs font-medium rounded-md ml-auto", sentimentBadgeStyle[item.sentiment])}>
          {item.sentimentNm}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-gray-100 mb-2 leading-relaxed">{item.title}</h3>
      <div className="mb-2">
        <div className="text-xs text-blue-400 font-medium mb-1">AI 요약</div>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{item.summary}</p>
      </div>
    </div>
  );
}
