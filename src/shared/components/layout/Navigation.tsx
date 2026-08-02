"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth.store";
import { useOverlay } from "@/system/overlay/useOverlay";
import GuestCta from "@/shared/components/feedback/GuestCta";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps){

  const router = useRouter();
  const pathname = usePathname();
  const { openPopup } = useOverlay();

  // 로그인 정보
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 네비게이션 활성화
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // 네비게이션 클릭
  const handleNavClick = (label: string, href: string, onlyUser: boolean) => {
    
    const accessible = !onlyUser || (onlyUser && isLoggedIn);
    if (accessible) return router.push(href);

    // 비로그인 사용자 접근 불가 → 로그인 유도 CTA
    openPopup(label, <GuestCta href={href} />);
  };

  return (
    <nav className={className}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.href}
          className={clsx("text-sm md:text-base font-medium whitespace-nowrap transition-colors", isActive(item.href) ? "text-white" : "text-gray-400 hover:text-white")}
          onClick={() => handleNavClick(item.label, item.href, item.onlyUser)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

// 네비게이션 목록
const NAV_ITEMS = [
  { label: "홈", href: "/", onlyUser: false },
  { label: "종목 검색", href: "/stock", onlyUser: false },
  { label: "뉴스 & AI 분석", href: "/news", onlyUser: false },
  { label: "주식 일지", href: "/journals", onlyUser: true },
];