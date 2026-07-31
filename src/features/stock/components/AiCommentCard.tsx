interface AiCommentCardProps {
  aiComment: string | null;
}

export default function AiCommentCard({ aiComment }: AiCommentCardProps) {

  if (!aiComment) return null;

  return (
    <div className="border-t border-gray-800 mt-6 pt-5">
      <h3 className="text-sm md:text-base font-semibold text-blue-400 mb-2.5">AI 코멘트</h3>
      <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{aiComment}</p>
    </div>
  );
}
