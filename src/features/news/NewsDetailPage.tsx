"use client";

import Link from "next/link";
import clsx from "clsx";
import { ChevronRight, ExternalLink } from "lucide-react";
import { useGetNewsDetailQuery } from "@/features/news/news.query";
import NewsDetailSkeleton from "@/features/news/skeleton/NewsDetailSkeleton";
import NotFoundFeedback from "@/shared/components/feedback/NotFoundFeedback";
import RelatedNewsCard from "@/features/news/components/RelatedNewsCard";
import RelatedStockChip from "@/features/news/components/RelatedStockChip";

interface NewsDetailPageProps {
  id: string | number;
}

export default function NewsDetailPage({ id }: NewsDetailPageProps) {

  const newsId = Number(id);
  const { data: news, isLoading, isError } = useGetNewsDetailQuery(isNaN(newsId) ? null : newsId);

  // 조회중
  if (isLoading) return <NewsDetailSkeleton />

  // 미존재
  if (!news || isError) return <NotFoundFeedback text="뉴스 목록으로 이동" href="/news" className="h-[calc(100vh-170px)] md:h-[calc(100vh-160px)]" />

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <div className="flex flex-col md:flex-row gap-10 justify-between">
        {/* 뉴스 상세 */}
        <article className="flex-1 min-w-0">
          {/* 주체 종목 · AI 평가 */}
          <div className="flex items-center gap-2 mb-3 text-sm">
            <Link
              href={`/stocks/${news.stockCode}`}
              className="inline-flex items-center gap-0.5 font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              {news.stockName}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <span className={clsx("px-2 py-0.5 text-sm font-medium rounded-md ml-auto", sentimentStyles[news.sentiment])}>
              {news.sentimentNm} {news.confidence}%
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-base md:text-2xl font-bold text-gray-100 leading-relaxed mb-1">{news.title}</h1>
          <p className="text-xs md:text-sm text-gray-600 mb-4">{news.publishedAt} · {news.categoryNm}</p>

          {/* 내용 */}
          <div className="border-t border-gray-800 pt-8 space-y-9">
            <section>
              <h2 className="text-sm font-medium text-blue-400 mb-3">AI 요약</h2>
              <p className="text-sm md:text-[15px] text-gray-300 leading-relaxed">{news.summary}</p>
            </section>

            <section>
              <h2 className="text-sm font-medium text-blue-400 mb-3">AI 평가 근거</h2>
              <p className="text-sm md:text-[15px] text-gray-400 leading-relaxed border-l-2 border-gray-700 pl-4">
                {news.reasoning}
              </p>
            </section>

            <section>
              <h2 className="text-sm font-medium text-blue-400 mb-3">관련 종목 영향</h2>
              <div className="flex flex-wrap gap-2">
                {news.relatedStocks.map((stock) => (
                  <RelatedStockChip key={stock.stockCode} stock={stock} />
                ))}
              </div>
            </section>
          </div>

          {/* 출처 */}
          <div className="md:border-t md:border-gray-800 mt-4 md:mt-8 pt-4 text-xs md:text-sm text-gray-500 text-right">
            <span>출처: {news.sourceName} · </span>
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-gray-300 transition-colors"
            >
              원문 보기
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </article>

        {/* 데스크탑: 연관 뉴스 */}
        <RelatedNewsCard id={news.id} stockName={news.stockName} />
      </div>
    </div>
  );
}

// AI 평가에 따른 스타일
const sentimentStyles: Record<string, string> = {
  POSITIVE: "bg-red-900 text-red-200",
  NEUTRAL: "bg-gray-700 text-gray-300",
  NEGATIVE: "bg-sky-900 text-sky-200",
};

