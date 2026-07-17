"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetMeQuery } from "@/features/auth/auth.query";
import { useAuthStore } from "@/shared/store/auth.store";
import { isSafeReturnUrl } from "@/features/auth/auth.lib";

/** 라우트 가드 (비로그인 전용 페이지) */
export default function GuestRoute({ children }: PropsWithChildren) {

  const router = useRouter();
  const searchParams = useSearchParams();

  const { isLoading } = useGetMeQuery();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const returnUrl = searchParams.get("returnUrl");
  const redirectTo = isSafeReturnUrl(returnUrl) ? returnUrl : "/";

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace(redirectTo);
  }, [isLoading, isLoggedIn, router, redirectTo]);

  if (isLoading || isLoggedIn) return null;

  return <>{children}</>;
}
