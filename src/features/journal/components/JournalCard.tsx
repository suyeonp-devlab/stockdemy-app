"use client";

import clsx from "clsx";
import { Journal } from "@/features/journal/journal.type";
import { useState } from "react";
import { formatDate } from "@/shared/utils/date-time";
import { formatPrice } from "@/shared/utils/number";

interface JournalCardProps {
  journal: Journal;
  onEdit: (id: string) => void;
}

export default function JournalCard({ journal, onEdit }: JournalCardProps) {

  // 카드 펼침 여부
  const [isExpanded, setIsExpanded] = useState(false);

  // 주식 거래 일자
  const journalDate = journal.tradeTime ? journal.tradeDate + journal.tradeTime : journal.tradeDate;

  // 카드 클릭 이벤트
  const handleClick = () => {
    if (journal.status === "STANDBY") onEdit(journal.id);
    else setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={handleClick}
        className="flex items-center gap-3 md:gap-4 py-3 px-2 -mx-2 cursor-pointer hover:bg-gray-900 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className={clsx("px-2 py-0.5 text-xs md:text-sm font-semibold rounded-sm flex-shrink-0", journal.tradeType === "BUY" ? "bg-red-950 text-red-300" : "bg-sky-950 text-sky-300")}>
              {journal.tradeTypeNm}
            </span>
            <span className="font-medium text-gray-100 text-sm md:text-base truncate">{journal.stockName}</span>
          </div>
          <div className="text-xs md:text-sm text-gray-500 tabular-nums truncate mb-0.5">
            {journal.stockCode} · {journal.marketNm} · {journal.sectionNm}
          </div>
          <div className="text-xs md:text-sm text-gray-600 tabular-nums">
            거래일시: {formatDate(journalDate, journal.tradeTime ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd")}
          </div>
        </div>
        <div className="flex flex-col md:flex-row text-right text-xs md:text-sm text-gray-400 tabular-nums flex-shrink-0 gap-0.5 md:gap-4">
          <div className="mb-0.5">{formatPrice(journal.price, journal.market)}</div>
          <div className="mb-0.5 min-w-10">{journal.quantity}주</div>
          <div className={clsx("mb-1.5 w-22 md:text-base", statusStyles[journal.status])}>{journal.statusNm}</div>
        </div>
      </div>

      {/* 펼침 상태 */}
      {isExpanded && (
        <div className="pb-6">
          <div className="flex flex-col gap-4">
            {/* 사용자 메모 */}
            <div className="flex gap-3">
              <div className="w-1 rounded-full flex-shrink-0 bg-gray-700" />
              <div className="text-xs md:text-sm">
                <p className="text-gray-500 font-semibold mb-1.5">메모</p>
                <p className="text-gray-400 leading-relaxed">{journal.memo || "작성된 메모가 없습니다."}</p>
              </div>
            </div>

            {/* AI 복기 분석 */}
            {journal.status !== "STANDBY" && (
              <div className="flex gap-3">
                <div className="w-1 rounded-full flex-shrink-0 bg-blue-500" />
                <div className="text-xs md:text-sm">
                  <p className="text-blue-400 font-semibold mb-1.5">AI 복기 분석</p>
                  <p className="text-gray-400 leading-relaxed">{journal.aiComment || "AI 복기 분석 결과를 준비 중입니다."}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// AI 분석 상태 스타일
const statusStyles: Record<string, string> = {
  DONE: "text-blue-400",
  PENDING: "text-amber-400",
  STANDBY: "text-gray-300",
};
