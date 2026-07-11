import Link from "next/link";
import MainHeader from "@/shared/components/layout/MainHeader";

export default function AuthHeader() {

  return (
    <>
      {/* PC - 일반 헤더 */}
      <div className="hidden md:block">
        <MainHeader />
      </div>

      {/* 모바일 - 로고 헤더 */}
      <header className="md:hidden bg-gray-950">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-4 md:py-6">
          <Link href="/" className="text-2xl md:text-3xl font-bold text-blue-400">
            Stockdemy
          </Link>
        </div>
      </header>
    </>
  );
}
