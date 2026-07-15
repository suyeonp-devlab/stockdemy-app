"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/features/auth/auth.query";
import { useAuthStore } from "@/shared/store/auth.store";

/** 라우트 가드 (로그인 필수 페이지) */
export default function ProtectedRoute({ children }: PropsWithChildren) {

  const router = useRouter();

  const { isLoading } = useGetMeQuery();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/login");
  }, [isLoading, isLoggedIn, router]);

  if (isLoading || !isLoggedIn) return null;

  return <>{children}</>;
}
