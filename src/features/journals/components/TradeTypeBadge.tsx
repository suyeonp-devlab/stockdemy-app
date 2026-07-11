import clsx from "clsx";
import { TradeType } from "@/features/journals/journals.type";

// 매수/매도 뱃지
export default function TradeTypeBadge({ type }: { type: TradeType }) {
  return (
    <span className={clsx(
      "px-2 py-0.5 text-xs font-semibold rounded-md",
      type === "BUY" ? "bg-red-950 text-red-300" : "bg-sky-950 text-sky-300"
    )}>
      {type === "BUY" ? "매수" : "매도"}
    </span>
  );
}
