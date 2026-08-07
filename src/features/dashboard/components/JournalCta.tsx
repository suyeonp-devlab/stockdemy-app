"use client";

import { useAuthStore } from "@/shared/store/auth.store";
import Button from "@/shared/components/button/Button";
import { useRouter } from "next/navigation";
import { buildLoginUrl } from "@/features/auth/auth.lib";

export default function JournalCta() {

  const router = useRouter();

  // 로그인 정보
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 px-6 py-8 h-full flex flex-col justify-center items-center text-center">
      <h3 className="text-lg md:text-xl font-bold text-white mb-3">
        내 투자 판단을 AI로 복기해보세요.
      </h3>
      <p className="text-sm md:text-base text-gray-400 mb-6">
        매수/매도 기록을 남기면<br/>AI가 당시 시장 흐름을 분석해드려요.
      </p>

      {isLoggedIn &&
        <Button variant="primary" width="lg" onClick={() => router.replace("/journal")}>
          주식 일지 바로가기
        </Button>
      }

      {!isLoggedIn &&
        <Button variant="primary" width="lg" onClick={() => router.replace(buildLoginUrl("/journal"))}>
          로그인 후 시작하기
        </Button>
      }
    </div>
  );
}
