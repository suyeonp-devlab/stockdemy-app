"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useMeQuery, useLogoutMutation } from "@/features/auth/auth.query";

const navItems = [
  { label: "홈", href: "/" },
  { label: "종목 검색", href: "/stocks" },
  { label: "뉴스 & AI 분석", href: "/news" },
  { label: "주식 일지", href: "/journals" },
];

export default function MainHeader() {

  const pathname = usePathname();
  const router = useRouter();

  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const { mutateAsync: logout } = useLogoutMutation();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

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
          <nav className="hidden md:flex items-center gap-6 mt-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "font-medium transition-colors",
                  isActive(item.href) ? "text-white" : "text-gray-400 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* 우상단 */}
        <div className="flex items-center gap-4 mt-1">
          {!isMeLoading && (
            me ? (
              <>
                <Link href="/me" className="text-sm md:text-base font-medium text-gray-400 hover:text-white transition-colors">
                  마이페이지
                </Link>
                <button onClick={handleLogout} className="text-sm md:text-base font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm md:text-base font-medium text-gray-400 hover:text-white transition-colors">
                  로그인
                </Link>
                <Link href="/signup" className="text-sm md:text-base font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  회원가입
                </Link>
              </>
            )
          )}
        </div>
      </div>

      {/* 모바일 네비 */}
      <div className="md:hidden border-t border-gray-800 px-6 py-3 flex items-center gap-6 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "text-sm font-medium whitespace-nowrap transition-colors",
              isActive(item.href) ? "text-white" : "text-gray-400"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
