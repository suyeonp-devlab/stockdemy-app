import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps){

  const pathname = usePathname();

  // 네비게이션 활성화
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className={className}>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "text-sm md:text-base font-medium whitespace-nowrap transition-colors",
            isActive(item.href) ? "text-white" : "text-gray-400 hover:text-white"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

// 네비게이션 목록
const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "종목 검색", href: "/stock" },
  { label: "뉴스 & AI 분석", href: "/news" },
  { label: "주식 일지", href: "/journals" },
];