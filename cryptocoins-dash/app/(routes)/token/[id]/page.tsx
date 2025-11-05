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
import { CurrencySelect } from "@/components/crypto/CurrencySelect";
import { ErrorBoundary } from "@/components/crypto/ErrorBoundary";
import { ExportButton } from "@/components/crypto/ExportButton";
import { WalletConnectButton } from "@/components/crypto/WalletConnectButton";
import { TokenBalance } from "@/components/crypto/TokenBalance";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ vs?: string }> | { vs?: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const coinName = id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    title: `${coinName} - Crypto Dashboard`,
    description: `View ${coinName} price, market data, and news`,
  };
}

export default async function CoinPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp =
    searchParams instanceof Promise ? await searchParams : searchParams || {};
  const vs = (sp.vs as string | undefined)?.toLowerCase() || "usd";

  let coinData;
  let historicalData;
  let marketData;
  let news;

  try {
    coinData = await getCoinData(id, vs);
    [historicalData, marketData, news] = await Promise.all([
      getHistoricalData(id, 1, vs),
      getCoinMarketData(id, vs),
      getCryptoNews({ coinId: id, symbol: coinData.symbol }).catch(() => []),
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
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="flex justify-between items-center mb-8 gap-3 flex-wrap">
            <WalletConnectButton />
            <div className="flex items-center gap-2 flex-wrap">
              <TokenBalance coinId={id} symbol={coinData.symbol} />
              <CurrencySelect value={vs.toUpperCase()} />
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
            currency={vs.toUpperCase()}
          />

          <div className="mt-6 min-w-0">
            <PriceChart
              coinId={id}
              initialData={historicalData}
              currency={vs.toUpperCase()}
            />
          </div>

          <div className="mt-12">
            <MarketDataComponent
              coinId={id}
              initialMarketData={marketData}
              currency={vs.toUpperCase()}
            />
          </div>

          <div className="mt-12">
            <NewsSection
              coinId={id}
              symbol={coinData.symbol}
              initialNews={news}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
