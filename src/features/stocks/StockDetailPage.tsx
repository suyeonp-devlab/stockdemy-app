"use client";

import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useStockDetailQuery } from "@/features/stocks/stocks.query";
import { useNewsListQuery } from "@/features/news/news.query";
import { useDisclosuresQuery } from "@/features/stocks/stocks.query";
import { Market, StockDetail, Disclosure } from "@/features/stocks/stocks.type";
import { AiSentiment, NewsItem } from "@/features/dashboard/dashboard.type";
import Skeleton from "@/shared/components/skeleton/Skeleton";
import PriceChart from "@/features/stocks/components/PriceChart";

// AI 평가 배지 스타일
const sentimentStyle: Record<AiSentiment, string> = {
  긍정: "bg-red-950 text-red-300",
  중립: "bg-gray-800 text-gray-400",
  부정: "bg-sky-950 text-sky-300",
};

// 가격 포맷
const formatPrice = (value: number, market: Market) =>
  market === "NASDAQ" ? `$${value.toFixed(2)}` : `${value.toLocaleString()}원`;

// 큰 단위 금액 포맷 (시가총액, 거래대금)
const formatLargeCurrency = (value: number, market: Market) => {
  if (market === "NASDAQ") {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    return `$${(value / 1e6).toFixed(0)}M`;
  }
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}조원`;
  if (value >= 1e8) return `${Math.round(value / 1e8).toLocaleString()}억원`;
  return `${value.toLocaleString()}원`;
};

// AI 코멘트 생성 (mock)
const getStockComment = (detail: StockDetail) => {
  const direction = detail.changePercent >= 0 ? "상승" : "하락";
  const valuation = detail.per > detail.sectorPer
    ? "동일업종 평균보다 밸류에이션이 높은 편이에요."
    : "동일업종 평균보다 밸류에이션이 낮은 편이에요.";
  return `${detail.name}은 전일 대비 ${Math.abs(detail.changePercent).toFixed(1)}% ${direction}했습니다. PER ${detail.per.toFixed(1)}배로 ${valuation}`;
};

export default function StockDetailPage({ code }: { code: string }) {

  const { data: detail, isLoading, isError } = useStockDetailQuery(code);
  const { data: news } = useNewsListQuery();
  const { data: disclosures } = useDisclosuresQuery();

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
        <Skeleton className="h-4 w-24 mb-6" />

        {/* 헤더 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-7 w-28 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* 데스크탑: 2단 그리드 */}
        <div className="hidden md:grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-6">
            <SkeletonCard bodyClassName="h-[420px]" />
            <SkeletonCard bodyClassName="h-24" />
            <SkeletonCard bodyClassName="h-24" />
          </div>
          <div className="col-span-4 space-y-6">
            <SkeletonCard bodyClassName="h-16" />
            <SkeletonCard bodyClassName="h-32" />
            <SkeletonCard bodyClassName="h-32" />
          </div>
        </div>

        {/* 모바일: 세로 나열 */}
        <div className="md:hidden flex flex-col gap-6">
          <SkeletonCard bodyClassName="h-[280px]" />
          <SkeletonCard bodyClassName="h-24" />
          <SkeletonCard bodyClassName="h-24" />
          <SkeletonCard bodyClassName="h-16" />
          <SkeletonCard bodyClassName="h-32" />
          <SkeletonCard bodyClassName="h-32" />
        </div>
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10 text-center">
        <p className="text-sm font-medium text-gray-400 mb-1">존재하지 않는 종목입니다.</p>
        <Link href="/stocks" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">종목 검색으로 돌아가기</Link>
      </div>
    );
  }

  const relatedNews = news?.filter((item) => item.stockName === detail.name) ?? [];
  const relatedDisclosures = disclosures?.filter((item) => item.corpName === detail.name) ?? [];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <Link href="/stocks" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" />
        종목 검색으로
      </Link>

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-100">{detail.name}</h1>
            <span className={sentimentBadgeClass(detail.aiSentiment)}>{detail.aiSentiment}</span>
          </div>
          <p className="text-sm text-gray-500">{detail.code} · {detail.market} · {detail.sector}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-100">{formatPrice(detail.price, detail.market)}</div>
          <div className={`text-sm font-medium tabular-nums ${detail.changePercent >= 0 ? "text-red-400" : "text-sky-400"}`}>
            {detail.changePercent >= 0 ? "▲ +" : "▼ "}{detail.changePercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 데스크탑: 좌(차트/시세/밸류에이션) 우(AI코멘트/뉴스/공시) */}
      <div className="hidden md:grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <ChartCard detail={detail} />
          <PriceInfoCard detail={detail} />
          <ValuationCard detail={detail} />
        </div>
        <div className="col-span-4 space-y-6">
          <AiCommentCard detail={detail} />
          <NewsCard news={relatedNews} />
          <DisclosureCard disclosures={relatedDisclosures} />
        </div>
      </div>

      {/* 모바일: 세로 나열 */}
      <div className="md:hidden flex flex-col gap-6">
        <ChartCard detail={detail} />
        <PriceInfoCard detail={detail} />
        <ValuationCard detail={detail} />
        <AiCommentCard detail={detail} />
        <NewsCard news={relatedNews} />
        <DisclosureCard disclosures={relatedDisclosures} />
      </div>
    </div>
  );
}

function sentimentBadgeClass(sentiment: AiSentiment) {
  return `px-2 py-1 text-xs font-medium rounded-lg ${sentimentStyle[sentiment]}`;
}

// 차트
function ChartCard({ detail }: { detail: StockDetail }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">차트 (30일)</h3>
      <PriceChart data={detail.priceHistory} />
    </div>
  );
}

// 시세 정보
function PriceInfoCard({ detail }: { detail: StockDetail }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">시세 정보</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="전일종가" value={formatPrice(detail.prevClose, detail.market)} />
        <Stat label="시가" value={formatPrice(detail.open, detail.market)} />
        <Stat label="고가" value={formatPrice(detail.high, detail.market)} />
        <Stat label="저가" value={formatPrice(detail.low, detail.market)} />
        <Stat label="거래량" value={detail.volume.toLocaleString()} />
        <Stat label="거래대금" value={formatLargeCurrency(detail.tradingValue, detail.market)} />
        <Stat label="52주 최고" value={formatPrice(detail.week52High, detail.market)} />
        <Stat label="52주 최저" value={formatPrice(detail.week52Low, detail.market)} />
        <Stat label="시가총액" value={formatLargeCurrency(detail.marketCap, detail.market)} />
        <Stat label="상장주식수" value={detail.sharesOutstanding.toLocaleString()} />
        {detail.market !== "NASDAQ" && <Stat label="외국인 소진율" value={`${detail.foreignOwnership.toFixed(1)}%`} />}
      </div>
    </div>
  );
}

// 밸류에이션
function ValuationCard({ detail }: { detail: StockDetail }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">밸류에이션</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="PER" value={`${detail.per.toFixed(1)}배`} />
        <Stat label="EPS" value={formatPrice(detail.eps, detail.market)} />
        <Stat label="PBR" value={`${detail.pbr.toFixed(1)}배`} />
        <Stat label="BPS" value={formatPrice(detail.bps, detail.market)} />
        <Stat label="배당수익률" value={`${detail.dividendYield.toFixed(1)}%`} />
        <Stat label="동일업종 PER" value={`${detail.sectorPer.toFixed(1)}배`} />
      </div>
    </div>
  );
}

// AI 코멘트
function AiCommentCard({ detail }: { detail: StockDetail }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">AI 코멘트</h3>
      <div className="flex items-start gap-2 bg-gray-800/60 rounded-xl p-3">
        <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-300 leading-relaxed">{getStockComment(detail)}</p>
      </div>
    </div>
  );
}

// 관련 뉴스
function NewsCard({ news }: { news: NewsItem[] }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">관련 뉴스</h3>
      {news.length === 0 ? (
        <p className="text-xs text-gray-600">관련 뉴스가 없어요.</p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-600">{item.publishedAt}</span>
              </div>
              <p className="text-xs font-medium text-gray-200 leading-relaxed">{item.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 관련 공시
function DisclosureCard({ disclosures }: { disclosures: Disclosure[] }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-gray-100 mb-4">관련 공시</h3>
      {disclosures.length === 0 ? (
        <p className="text-xs text-gray-600">관련 공시가 없어요.</p>
      ) : (
        <div className="space-y-4">
          {disclosures.map((item) => (
            <div key={item.id}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-600">{item.receivedAt}</span>
              </div>
              <p className="text-xs font-medium text-gray-200 leading-relaxed">{item.reportName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 카드 로딩 스켈레톤 (제목 줄 + 본문 영역)
function SkeletonCard({ bodyClassName }: { bodyClassName: string }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className={clsx("w-full rounded-xl", bodyClassName)} />
    </div>
  );
}

// 시세/밸류에이션 지표 한 칸
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-medium text-gray-100 tabular-nums">{value}</div>
    </div>
  );
}
