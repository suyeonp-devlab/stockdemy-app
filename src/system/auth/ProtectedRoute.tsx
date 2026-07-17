"use client";

import { PropsWithChildren, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "@/features/auth/auth.query";
import { useAuthStore } from "@/shared/store/auth.store";
import { buildLoginUrl } from "@/features/auth/auth.lib";

/** 라우트 가드 (로그인 필수 페이지) */
export default function ProtectedRoute({ children }: PropsWithChildren) {

  const router = useRouter();
  const pathname = usePathname();

  const { isLoading } = useGetMeQuery();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace(buildLoginUrl(pathname));
  }, [isLoading, isLoggedIn, router, pathname]);

  if (isLoading || !isLoggedIn) return null;

  return <>{children}</>;
}
