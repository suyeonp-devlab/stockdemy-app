"use client";

import { ChevronRight, KeyRound, UserX } from "lucide-react";
import { useGetMeQuery } from "@/features/auth/auth.query";
import { useOverlay } from "@/system/overlay/useOverlay";
import WithdrawForm from "@/features/auth/withdraw/WithdrawForm";
import ChangePasswordForm from "@/features/auth/change-password/ChangePasswordForm";
import MeProfileCardSkeleton from "@/features/me/skeleton/MeProfileCardSkeleton";
import MeProfileCard from "@/features/me/components/MeProfileCard";

export default function MePage() {

  const { openPopup } = useOverlay();

  const { data: me, isLoading } = useGetMeQuery();

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">마이페이지</h1>
        <p className="text-sm text-gray-400">내 계정 정보를 확인하고 관리해보세요.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {isLoading ? <MeProfileCardSkeleton /> : <MeProfileCard me={me!} />}

        <div className="bg-gray-900 rounded-md border border-gray-800 divide-y divide-gray-800 overflow-hidden flex-1">
          <button
            type="button"
            onClick={() => openPopup("비밀번호 변경", <ChangePasswordForm />)}
            className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-800 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="flex-1 text-sm text-gray-200">비밀번호 변경</span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>

          <button
            type="button"
            onClick={() => openPopup("회원 탈퇴", <WithdrawForm />)}
            className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-800 transition-colors"
          >
            <UserX className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="flex-1 text-sm text-red-400">회원 탈퇴</span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
