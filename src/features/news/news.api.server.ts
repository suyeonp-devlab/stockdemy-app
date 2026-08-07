import { NewsDetail } from "@/features/news/news.type";
import { ApiResponse } from "@/shared/types/api.type";

// 뉴스 상세 조회 (서버 컴포넌트 전용)
export const getNewsDetailServer = async (id: string | number): Promise<NewsDetail | null> => {

  const newsId = Number(id);
  if (isNaN(newsId)) return null;

  const response = await fetch(`${process.env.INTERNAL_API_URL}/api/news/${newsId}`, { next: { revalidate: 300 } });
  if (!response.ok) return null;

  const body: ApiResponse<NewsDetail> = await response.json();
  return body.data;
};
