import React from "react";
import { Stock } from "@/features/stock/stock.type";
import { Loader2 } from "lucide-react";

interface StockAutocompleteProps {
  isLoading: boolean;
  stockList: Stock[];
  onSelect: (stock: Stock) => void;
}

export default function StockAutocomplete({ isLoading, stockList, onSelect }: StockAutocompleteProps) {

  return (
    <div className="absolute z-10 mt-1.5 w-full bg-gray-800 border border-gray-600 rounded-md overflow-hidden">
      {/* 조회중 */}
      {isLoading &&  (
        <div className="flex justify-center px-4 py-4">
          <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-gray-500" />
        </div>
      )}

      {/* 미존재 */}
      {!isLoading && stockList.length === 0 && (
        <div className="px-4 py-4 text-sm font-medium text-gray-100">
          검색결과가 존재하지 않습니다.
        </div>
      )}

      {/* 존재 */}
      {!isLoading && stockList.length > 0 && stockList.map((stock) => (
        <button
          key={stock.stockCode}
          type="button"
          onClick={() => onSelect(stock)}
          className="w-full text-left px-4 py-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
        >
          <div className="text-sm font-medium text-gray-100 mb-1">
            {stock.stockName}
          </div>
          <div className="text-xs text-gray-500">
            {stock.stockCode} · {stock.marketNm} · {stock.sectorNm}
          </div>
        </button>
      ))}
    </div>
  );
}