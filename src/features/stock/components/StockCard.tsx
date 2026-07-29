import clsx from "clsx";
import React from "react";
import Link from "next/link";
import { Stock } from "@/features/stock/stock.type";
import { useToggleStockFavoriteMutation } from "@/features/stock/stock.query";
import { Star } from "lucide-react";
import IconButton from "@/shared/components/button/IconButton";
import { useAuthStore } from "@/shared/store/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useOverlay } from "@/system/overlay/useOverlay";
import { buildLoginUrl } from "@/features/auth/auth.lib";
import { formatPrice } from "@/shared/utils/number";
import { FlashDirection } from "@/features/stock/components/StockCardWrap";

interface StockCardProps {
  stock: Stock
  logoClassName: string;
  flashDirection?: FlashDirection;
}

export default function StockCard({
  stock,
  logoClassName,
  flashDirection
}: StockCardProps) {

  const router = useRouter();
  const pathname = usePathname();
  const { confirm } = useOverlay();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const { mutate: toggleFavorite } = useToggleStockFavoriteMutation();

  // 즐겨찾기
  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      const confirmed = await confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?");
      if (confirmed) router.push(buildLoginUrl(pathname));
      return;
    }

    void toggleFavorite({ stockCode: stock.stockCode, favorite: !stock.favorite });
  }

  return (
    <Link
      href={`/stock/${stock.stockCode}`}
      className={clsx(
        "flex items-center gap-3.5 py-3 px-2 -mx-2 hover:bg-gray-800 transition-colors cursor-pointer",
        flashDirection === "up" && "animate-flash-up",
        flashDirection === "down" && "animate-flash-down"
      )}
    >
      <div className={clsx("w-9 h-9 md:w-10 md:h-10 rounded-md flex items-center justify-center text-sm font-bold flex-shrink-0", logoClassName)}>
        {stock.stockName.slice(0, 1)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-medium text-gray-100 text-sm md:text-base truncate mb-0.5">{stock.stockName}</div>
        <div className="text-xs text-gray-500 truncate">{stock.stockCode} · {stock.marketNm} · {stock.sectorNm}</div>
      </div>

      <div className="text-right flex-shrink-0 mr-2">
        <div className="text-sm md:text-base font-medium text-gray-100 whitespace-nowrap mb-0.5">
          {formatPrice(stock.price, stock.market)}
        </div>
        <div className={clsx("text-xs md:text-sm tabular-nums", stock.changePercent >= 0 ? "text-red-400" : "text-sky-400")}>
          {stock.changePercent >= 0 ? "▲ +" : "▼ "}{stock.changePercent}%
        </div>
      </div>

      <span className={clsx("hidden sm:inline-flex px-2 py-0.5 text-sm font-medium rounded-md flex-shrink-0", sentimentStyle[stock.sentiment])}>
        {stock.sentimentNm}
      </span>

      <IconButton
        icon={<Star size="20" fill={stock.favorite ? "currentColor" : "none"} />}
        size="md"
        aria-label="즐겨찾기"
        onClick={handleFavorite}
        className={stock.favorite ? "!text-blue-400" : "text-gray-600 hover:!text-blue-400 transition-colors"}
      />
    </Link>
  );
}

// AI 평가에 따른 스타일
const sentimentStyle: Record<string, string> = {
  POSITIVE: "bg-red-900 text-red-200",
  NEUTRAL: "bg-gray-700 text-gray-300",
  NEGATIVE: "bg-sky-900 text-sky-200",
};
