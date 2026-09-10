import { StockFundamentals, TodayQuote } from "@/features/stock/stock.type";
import { formatLargeCurrency, formatNumber, formatPrice } from "@/shared/utils/number";
import StockInfoRow from "@/features/stock/components/StockInfoRow";
import { formatDate } from "@/shared/utils/date-time";

interface StockInfoCardProps {
  fundamentals: StockFundamentals;
  todayQuote: TodayQuote;
}

// 값 없음 표시
const EMPTY = "-";

// 수집된 값 여부 (서버가 미수집 항목을 응답에서 빼므로 undefined도 함께 확인)
const hasValue = (value: number | null | undefined): value is number => value !== null && value !== undefined;

export default function StockInfoCard({ fundamentals, todayQuote }: StockInfoCardProps) {

  const { sharesOutstanding, market, eps, bps, annualDividend, sectorPer, foreignOwnership } = fundamentals;
  const { price, todayBar, updatedAt } = todayQuote;

  const marketCap = hasValue(sharesOutstanding) ? price * sharesOutstanding : null;
  const per = hasValue(eps) && eps !== 0 ? price / eps : null;
  const pbr = hasValue(bps) && bps !== 0 ? price / bps : null;
  const dividendYield = hasValue(annualDividend) && annualDividend > 0 ? (annualDividend / price) * 100 : null;

  // 실시간 시세 신고가/신저가 반영
  const week52High = hasValue(fundamentals.week52High) ? Math.max(fundamentals.week52High, todayBar.high) : todayBar.high;
  const week52Low = hasValue(fundamentals.week52Low) ? Math.min(fundamentals.week52Low, todayBar.low) : todayBar.low;

  return (
    <div>
      {/* 시세 정보 */}
      <div>
        <div className="flex justify-between">
          <h3 className="text-sm md:text-base font-semibold text-gray-100 mb-4 pl-1">시세 정보</h3>
          <div className="text-xs md:text-sm text-gray-500">{formatDate(updatedAt, "yyyy-MM-dd HH:mm")} 기준</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StockInfoRow label="시가" value={formatPrice(todayBar.open, market)} />
          <StockInfoRow label="고가" value={formatPrice(todayBar.high, market)} />
          <StockInfoRow label="저가" value={formatPrice(todayBar.low, market)} />
          <StockInfoRow label="거래량" value={formatNumber(todayBar.volume)} />
          <StockInfoRow label="거래대금" value={formatLargeCurrency(todayBar.tradingValue, market)} />
          <StockInfoRow label="52주 최고" value={formatPrice(week52High, market)} />
          <StockInfoRow label="52주 최저" value={formatPrice(week52Low, market)} />
          <StockInfoRow label="시가총액" value={marketCap !== null ? formatLargeCurrency(marketCap, market) : EMPTY} />
        </div>
      </div>

      {/* 밸류에이션 */}
      <div className="border-t border-gray-800 mt-5 pt-5">
        <h3 className="text-sm md:text-base font-semibold text-gray-100 mb-4 pl-1">밸류에이션</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StockInfoRow label="PER" value={per !== null ? `${formatNumber(per.toFixed(1))}배` : EMPTY} />
          <StockInfoRow label="EPS" value={hasValue(eps) ? formatPrice(eps, market) : EMPTY} />
          <StockInfoRow label="PBR" value={pbr !== null ? `${formatNumber(pbr.toFixed(1))}배` : EMPTY} />
          <StockInfoRow label="BPS" value={hasValue(bps) ? formatPrice(bps, market) : EMPTY} />
          <StockInfoRow label="배당수익률" value={dividendYield !== null ? `${dividendYield.toFixed(1)}%` : EMPTY} />
          <StockInfoRow label="동일업종 PER" value={hasValue(sectorPer) ? `${formatNumber(sectorPer.toFixed(1))}배` : EMPTY} />
          <StockInfoRow label="상장주식수" value={hasValue(sharesOutstanding) ? formatNumber(sharesOutstanding) : EMPTY} />
          {fundamentals.market !== "NASDAQ" && (
            <StockInfoRow label="외국인 보유율" value={hasValue(foreignOwnership) ? `${foreignOwnership.toFixed(1)}%` : EMPTY} />
          )}
        </div>
      </div>
    </div>
  );
}
