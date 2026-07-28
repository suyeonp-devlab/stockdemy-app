import Link from "next/link";
import clsx from "clsx";
import { News } from "@/features/news/news.type";

interface NewsCardProps {
  news: News;
  showLogo?: boolean;
}

export default function NewsCard({ news, showLogo = true }: NewsCardProps) {

  return (
    <Link
      href={`/news/${news.id}`}
      className="block py-5 px-3 -mx-3 hover:bg-gray-900/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-3 md:mb-2">
        {showLogo && (
          <>
            <div className="w-8 h-6 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
              {news.stockName.slice(0, 2)}
            </div>
            <span className="text-sm text-gray-400">{news.stockName}</span>
            <span className="text-sm text-gray-600">·</span>
          </>
        )}
        <span className="text-sm text-gray-600">{news.publishedAt}</span>
        <span className={clsx("px-2 py-0.5 text-sm font-medium rounded-md ml-auto", sentimentStyles[news.sentiment])}>
          {news.sentimentNm}
        </span>
      </div>
      <h3 className="text-sm md:text-base font-semibold text-gray-100 mb-2 leading-relaxed truncate">{news.title}</h3>
      <div className="mb-2">
        <div className="text-xs md:text-sm text-blue-400 font-medium mb-1">AI 요약</div>
        <p className="text-xs md:text-sm text-gray-400 leading-relaxed line-clamp-2">{news.summary}</p>
      </div>
    </Link>
  );
}

// AI 평가에 따른 스타일
const sentimentStyles: Record<string, string> = {
  POSITIVE: "bg-red-900 text-red-200",
  NEUTRAL: "bg-gray-700 text-gray-300",
  NEGATIVE: "bg-sky-900 text-sky-200",
};