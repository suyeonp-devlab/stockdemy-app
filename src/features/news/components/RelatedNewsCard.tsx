import { useGetNewsListQuery } from "@/features/news/news.query";
import RelatedNewsCardSkeleton from "@/features/news/skeleton/RelatedNewsCardSkeleton";
import RelatedNewsRow from "@/features/news/components/RelatedNewsRow";

interface RelatedNewsCardProps {
  id: number;
  stockName: string;
}

export default function RelatedNewsCard({
  id,
  stockName
}: RelatedNewsCardProps) {

  const { data: relatedResponse, isLoading } = useGetNewsListQuery(
    { category: "", stockName: stockName, favorite: false, page: 1, pageSize: 6 }
  );

  // 연관 뉴스 (동일 종목 + 현재 뉴스 제외)
  const relatedNewsList = (relatedResponse?.items ?? []).filter((item) => item.id !== id).slice(0, 5);

  // 조회중
  if (isLoading) return <RelatedNewsCardSkeleton />

  return (
    <div className="hidden md:block w-76 flex-shrink-0">
      <div className="sticky top-32">
        <div className="bg-gray-900 rounded-md border border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-100 mb-2">{stockName} 관련 뉴스</h3>

          {relatedNewsList.length === 0 && (
            <p className="text-sm text-gray-500 py-2">관련 뉴스가 없습니다.</p>
          )}

          {relatedNewsList.length > 0 && (
            <div className="divide-y divide-gray-800/50">
              {relatedNewsList.map((relatedNews) => (
                <RelatedNewsRow key={relatedNews.id} news={relatedNews} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}