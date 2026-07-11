"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import IconButton from "@/shared/components/button/IconButton";
import MainHeader from "./MainHeader";

export default function DetailHeader() {

  const router = useRouter();

  return (
    <>
      {/* PC - 일반 헤더 */}
      <div className="hidden md:block">
        <MainHeader />
      </div>

      {/* 모바일 - 뒤로가기 헤더 */}
      <header className="md:hidden bg-gray-950 border-b border-gray-800 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-2">
          <IconButton
            icon={<ChevronLeft size={24} />}
            onClick={() => router.back()}
          />
        </div>
      </header>
    </>
  );
}
