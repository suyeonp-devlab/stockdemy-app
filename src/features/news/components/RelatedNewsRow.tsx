import Link from "next/link";
import { News } from "@/features/news/news.type";

interface RelatedNewsRowProps {
  news: News;
}

export default function RelatedNewsRow({ news }: RelatedNewsRowProps) {

  return (
    <Link href={`/news/${news.id}`} className="block py-2 group">
      <p className="text-xs text-gray-400 group-hover:text-gray-100 transition-colors leading-relaxed mb-1 truncate">{news.title}</p>
      <p className="text-xs text-gray-600 truncate">{news.publishedAt} · {news.sourceName}</p>
    </Link>
  );
}