import { notFound } from "next/navigation";
import {
  getCoinData,
  getHistoricalData,
  getCoinMarketData,
  ApiError,
} from "@/lib/api/coingecko";
import { getCryptoNews } from "@/lib/api/news";
import { PriceHeader } from "@/components/crypto/PriceHeader";
import { PriceChart } from "@/components/crypto/PriceChart";
import { MarketData as MarketDataComponent } from "@/components/crypto/MarketData";
import { NewsSection } from "@/components/crypto/NewsSection";
import { ThemeToggle } from "@/components/crypto/ThemeToggle";
import { ErrorBoundary } from "@/components/crypto/ErrorBoundary";
import { ExportButton } from "@/components/crypto/ExportButton";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const coinData = await getCoinData(id);
    return {
      title: `${coinData.name} (${coinData.symbol.toUpperCase()}) - Crypto Dashboard`,
      description: `View ${coinData.name} price, market data, and news`,
    };
  } catch {
    return {
      title: "Crypto Dashboard",
    };
  }
}

export default async function CoinPage({ params }: PageProps) {
  const { id } = await params;

  let coinData;
  let historicalData;
  let marketData;
  let news;

  try {
    [coinData, historicalData, marketData, news] = await Promise.all([
      getCoinData(id),
      getHistoricalData(id, 7),
      getCoinMarketData(id),
      getCryptoNews(id).catch(() => []),
    ]);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.statusCode === 404 || error.code === "COIN_NOT_FOUND")
    ) {
      notFound();
    }
    throw error;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Crypto Dashboard</h1>
            <div className="flex gap-2">
              <ExportButton
                coinData={coinData}
                marketData={marketData}
                coinId={id}
              />
              <ThemeToggle />
            </div>
          </div>

          <PriceHeader
            coinData={coinData}
            initialPrice={coinData.current_price}
            initialChange={coinData.price_change_percentage_24h}
            coinId={id}
          />

          <div className="mt-8">
            <PriceChart coinId={id} initialData={historicalData} />
          </div>

          <div className="mt-8">
            <MarketDataComponent coinId={id} initialMarketData={marketData} />
          </div>

          <div className="mt-8">
            <NewsSection coinId={id} initialNews={news} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
