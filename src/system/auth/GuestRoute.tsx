"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/features/auth/auth.query";
import { useAuthStore } from "@/shared/store/auth.store";

/** 라우트 가드 (비로그인 전용 페이지) */
export default function GuestRoute({ children }: PropsWithChildren) {

  const router = useRouter();

  const { isLoading } = useMeQuery();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace("/");
  }, [isLoading, isLoggedIn, router]);

  if (isLoading || isLoggedIn) return null;

  return <>{children}</>;
}
