"use client";

import Button from "@/shared/components/button/Button";
import { useRouter } from "next/navigation";
import { useOverlay } from "@/system/overlay/useOverlay";
import { buildLoginUrl } from "@/features/auth/auth.lib";

interface GuestCtaProps {
  href: string;
}

export default function GuestCta({ href }: GuestCtaProps) {

  const router = useRouter();
  const { closePopup } = useOverlay();

  const handleClick = () => {
    closePopup();
    router.push(buildLoginUrl(href));
  };

  return (
    <div className="text-center py-2">
      <p className="text-sm md:text-base font-semibold text-gray-100 mb-2.5">
        {hrefTexts[href].main}
      </p>
      <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 whitespace-pre-wrap">
        {hrefTexts[href].sub}
      </p>
      <Button variant="primary" width="lg" onClick={handleClick}>
        로그인하러 가기
      </Button>
    </div>
  );
}

// href 종류에 따른 문구
const hrefTexts: Record<string, { main: string, sub: string}> = {
  "/journal": { main: "나의 매매를 AI로 복기해보세요", sub: "매수·매도 기록을 바탕으로\nAI가 당시 시장 흐름을 분석해 드려요." }
}
