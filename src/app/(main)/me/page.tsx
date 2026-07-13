"use client";

import { useRouter } from "next/navigation";
import { useMeQuery, useLogoutMutation } from "@/features/auth/auth.query";
import Button from "@/shared/components/button/Button";
import ProtectedRoute from "@/system/auth/ProtectedRoute";

/** 마이페이지 */
export default function MePage() {

  const router = useRouter();

  const { data: me } = useMeQuery();

  const { mutateAsync: logout } = useLogoutMutation();

  // 로그아웃
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <div className="max-w-screen-md mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-100 mb-8">마이페이지</h2>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <p className="text-sm text-gray-400 mb-1">이메일</p>
          <p className="text-lg text-gray-100 mb-6">{me?.email}</p>
          <Button type="button" onClick={handleLogout} variant="secondary" width="md">
            로그아웃
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
