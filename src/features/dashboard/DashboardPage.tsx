import MarketTicker from "@/features/dashboard/components/MarketTicker";
import StockRankingCard from "@/features/dashboard/components/StockRankingCard";
import NewsHighlights from "@/features/dashboard/components/NewsHighlights";
import SectorRankingCard from "@/features/dashboard/components/SectorRankingCard";
import JournalCta from "@/features/dashboard/components/JournalCta";

export default function DashboardPage() {

  return (
    <>
      <MarketTicker />
      <section className="max-w-screen-2xl mx-auto px-3 md:px-6 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <StockRankingCard />
            <SectorRankingCard />
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <NewsHighlights />
            <JournalCta />
          </div>
        </div>
      </section>
    </>
  );
}
