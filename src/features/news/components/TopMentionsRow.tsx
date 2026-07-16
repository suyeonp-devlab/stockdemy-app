"use client";

import { MentionRanking } from "@/features/news/news.type";

interface TopMentionsRowProps {
  mention: MentionRanking
  onStockClick: (stockName: string) => void;
}

export default function TopMentionsRow({ mention, onStockClick }: TopMentionsRowProps) {

  return (
    <div
      className="flex items-center justify-between py-px pr-2 -mr-2 hover:bg-gray-800/50 transition-colors cursor-pointer"
      onClick={() => onStockClick(mention.stockName)}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gray-700 text-gray-300">
          {mention.stockName.slice(0, 2)}
        </div>
        <span className="text-xs text-gray-300 truncate">{mention.stockName}</span>
      </div>
      <span className="text-xs text-gray-500 flex-shrink-0">{mention.count}건</span>
    </div>
  );
}