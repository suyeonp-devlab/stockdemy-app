import { MeResponse } from "@/features/auth/auth.type";
import { formatDate } from "@/shared/utils/date-time";

interface MeProfileCardProps {
  me: MeResponse;
}

export default function MeProfileCard({ me }: MeProfileCardProps) {

  return (
    <div className="bg-gray-900 rounded-md border border-gray-800 py-6 px-4 flex items-center gap-4 flex-1">
      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
        {me.email.slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="text-sm text-gray-100 truncate mb-1">
          <span className="text-gray-500 mr-3">이메일</span>
          {me.email}
        </div>
        <div className="text-sm text-gray-100">
          <span className="text-gray-500 mr-3">가입일</span>
          {formatDate(me.createdAt, "yyyy년 MM월 dd일")}
        </div>
      </div>
    </div>
  );
}