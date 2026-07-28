import type { Metadata } from "next";
import { Suspense } from "react";
import NewsPage from "@/features/news/NewsPage";

export const metadata: Metadata = { title: "뉴스" };

export default function NewsRoutePage() {

  return (
    <Suspense fallback={null}>
      <NewsPage />
    </Suspense>
  );
}
