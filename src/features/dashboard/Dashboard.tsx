import MarketTicker from "@/features/dashboard/components/MarketTicker";
import StockRankingCard from "@/features/dashboard/components/StockRankingCard";
import NewsHighlights from "@/features/dashboard/components/NewsHighlights";
import SectorHeatmap from "@/features/dashboard/components/SectorHeatmap";
import LoginCta from "@/features/dashboard/components/LoginCta";

export default function Dashboard() {
  return (
    <>
      <MarketTicker />
      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12">
        <div className="grid md:grid-cols-2 gap-16">
          <StockRankingCard />
          <NewsHighlights />
        </div>
      </section>
      <SectorHeatmap />
      <LoginCta />
    </>
  );
}
