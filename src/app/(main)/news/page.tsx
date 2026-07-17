import type { Metadata } from "next";
import NewsPage from "@/features/news/NewsPage";

export const metadata: Metadata = { title: "뉴스" };

export default function NewsRoutePage() {
  return <NewsPage />
}
