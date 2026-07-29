import { StockFundamentals, TodayQuote } from "@/features/stock/stock.type";
import { formatLargeCurrency, formatNumber, formatPrice } from "@/shared/utils/number";
import StockInfoRow from "@/features/stock/components/StockInfoRow";
import { formatDate } from "@/shared/utils/date-time";

interface StockInfoCardProps {
  fundamentals: StockFundamentals;
  todayQuote: TodayQuote;
}

export default function StockInfoCard({ fundamentals, todayQuote }: StockInfoCardProps) {

  const { sharesOutstanding, market, eps, bps, annualDividend, sectorPer, foreignOwnership } = fundamentals;
  const { price, todayBar, updatedAt } = todayQuote;

  const marketCap = price * sharesOutstanding;
  const per = price / eps;
  const pbr = price / bps;
  const dividendYield = annualDividend > 0 ? (annualDividend / price) * 100 : null;

  // 실시간 시세 신고가/신저가 반영
  const week52High = Math.max(fundamentals.week52High, todayBar.high);
  const week52Low = Math.min(fundamentals.week52Low, todayBar.low);

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
          <StockInfoRow label="시가총액" value={formatLargeCurrency(marketCap, market)} />
        </div>
      </div>

      {/* 밸류에이션 */}
      <div className="border-t border-gray-800 mt-5 pt-5">
        <h3 className="text-sm md:text-base font-semibold text-gray-100 mb-4 pl-1">밸류에이션</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StockInfoRow label="PER" value={`${formatNumber(per.toFixed(1))}배`} />
          <StockInfoRow label="EPS" value={formatPrice(eps, market)} />
          <StockInfoRow label="PBR" value={`${formatNumber(pbr.toFixed(1))}배`} />
          <StockInfoRow label="BPS" value={formatPrice(bps, market)} />
          <StockInfoRow label="배당수익률" value={dividendYield !== null ? `${dividendYield.toFixed(1)}%` : "-"} />
          <StockInfoRow label="동일업종 PER" value={`${formatNumber(sectorPer.toFixed(1))}배`} />
          <StockInfoRow label="상장주식수" value={formatNumber(sharesOutstanding)} />
          {fundamentals.market !== "NASDAQ" && <StockInfoRow label="외국인 보유율" value={`${foreignOwnership.toFixed(1)}%`} />}
        </div>
      </div>
    </div>
  );
}
