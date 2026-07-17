import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getNewsDetailServer } from "@/features/news/news.api.server";
import NewsDetailPage from "@/features/news/NewsDetailPage";
import { getQueryClient } from "@/shared/lib/query-client";
import { NEWS_QUERY_KEYS } from "@/features/news/news.query";
import NotFoundFeedback from "@/shared/components/feedback/NotFoundFeedback";

interface NewsDetailRouteProps {
  params: Promise<{ id: string }>;
}

// SEO 메타태그 생성
export async function generateMetadata({ params }: NewsDetailRouteProps): Promise<Metadata> {

  const { id } = await params;

  const news = await getNewsDetailServer(id);
  if (!news) return { title: "뉴스 상세" };

  const description = news.summary.slice(0, 160);

  return {
    title: news.title,
    description,
    openGraph: { title: news.title, description, type: "article" },
  };
}

export default async function NewsDetailRoutePage({ params }: NewsDetailRouteProps) {

  const { id } = await params;

  const news = await getNewsDetailServer(id);
  if (!news) return <NotFoundFeedback text="뉴스 목록으로 이동" href="/news" className="h-[calc(100vh-170px)] md:h-[calc(100vh-160px)]" />

  // Query hydration
  const queryClient = getQueryClient();
  queryClient.setQueryData(NEWS_QUERY_KEYS.detail(Number(id)), news);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewsDetailPage id={id} />
    </HydrationBoundary>
  );
}
