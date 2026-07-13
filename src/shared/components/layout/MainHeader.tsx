"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMeQuery, useLogoutMutation } from "@/features/auth/auth.query";
import { useAuthStore } from "@/shared/store/auth.store";
import Navigation from "@/shared/components/layout/Navigation";

export default function MainHeader() {

  const router = useRouter();

  // 로그인 정보
  const { isLoading: isMeLoading } = useMeQuery();
  const { mutateAsync: logout } = useLogoutMutation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 로그아웃
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-4 md:py-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-blue-400">
            Stockdemy
          </Link>
          {/* 데스크탑 네비 */}
          <Navigation className="hidden md:flex items-center gap-6 mt-1" />
        </div>

        <div className="flex items-center gap-4 mt-1">
          {!isMeLoading && isLoggedIn && (
            <>
              <Link href="/me" className={LINK_CLASS}>마이페이지</Link>
              <button onClick={handleLogout} className={ACTION_CLASS}>로그아웃</button>
            </>
          )}
          {!isMeLoading && !isLoggedIn && (
            <>
              <Link href="/login" className={LINK_CLASS}>로그인</Link>
              <Link href="/signup" className={ACTION_CLASS}>회원가입</Link>
            </>
          )}
        </div>
      </div>

      {/* 모바일 네비 */}
      <Navigation className="md:hidden border-t border-gray-800 px-6 py-3 flex items-center gap-6 overflow-x-auto scrollbar-hide scroll-fade-mask" />
    </header>
  );
}

// 네비게이션 링크 스타일
const LINK_CLASS = "text-sm md:text-base font-medium text-gray-400 hover:text-white transition-colors";
const ACTION_CLASS = "text-sm md:text-base font-medium text-blue-400 hover:text-blue-300 transition-colors";
