"use client";

import type { MarketData } from "@/lib/types/crypto";
import {
  formatCurrency,
  formatLargeCurrency,
  formatPercentage,
  formatSupply,
} from "@/lib/utils/format";

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  subtitle?: string;
}

function MetricCard({ label, value, change, subtitle }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      {change !== undefined && (
        <p
          className={`text-sm font-medium mt-1 ${
            isPositive ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {formatPercentage(change)}
        </p>
      )}
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}

interface MarketDataProps {
  coinId: string;
  initialMarketData: MarketData;
  currency?: string;
}

export function MarketData({
  coinId,
  initialMarketData,
  currency = "USD",
}: MarketDataProps) {
  const supplyPercentage =
    initialMarketData.totalSupply > 0
      ? (initialMarketData.circulatingSupply / initialMarketData.totalSupply) *
        100
      : 100;

  const formatSupplyShort = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    return formatSupply(value);
  };

  const tickerSymbol =
    coinId.toUpperCase().slice(0, 3) === "ETH" ? "ETH" : coinId.toUpperCase();

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-8">Market data</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
        <MetricCard
          label="Market cap"
          value={formatLargeCurrency(initialMarketData.marketCap, currency)}
        />
        <MetricCard label="Rank" value={`#${initialMarketData.rank}`} />
        <MetricCard
          label="24H volume"
          value={formatLargeCurrency(initialMarketData.volume24h, currency)}
        />
        <MetricCard
          label="Circulating supply"
          value={`${formatSupplyShort(initialMarketData.circulatingSupply)} ${tickerSymbol}`}
          subtitle={`${supplyPercentage.toFixed(1)}% of total`}
        />
        <MetricCard
          label="All-time high"
          value={formatCurrency(initialMarketData.ath)}
          change={initialMarketData.athChangePercentage}
        />
        <MetricCard
          label="All-time low"
          value={formatCurrency(initialMarketData.atl)}
          change={initialMarketData.atlChangePercentage}
        />
        <MetricCard
          label="Total supply"
          value={`${formatSupplyShort(initialMarketData.totalSupply)} ${tickerSymbol}`}
        />
      </div>
    </div>
  );
}
