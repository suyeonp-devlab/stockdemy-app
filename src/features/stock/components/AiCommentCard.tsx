import { formatDate } from "@/shared/utils/date-time";

interface AiCommentCardProps {
  aiComment: string | null;
  analyzedAt?: string | null;
}

export default function AiCommentCard({ aiComment, analyzedAt }: AiCommentCardProps) {

  if (!aiComment) return null;

  return (
    <div className="border-t border-gray-800 mt-6 pt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm md:text-base font-semibold text-blue-400">AI 코멘트</h3>
        {/* 분석 기준일 (종목마다 분석 주기가 길어 코멘트 시점을 밝힘) */}
        {analyzedAt && <span className="text-xs text-gray-500">{formatDate(analyzedAt, "yyyy.MM.dd")} 기준</span>}
      </div>
      <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{aiComment}</p>
    </div>
  );
}
