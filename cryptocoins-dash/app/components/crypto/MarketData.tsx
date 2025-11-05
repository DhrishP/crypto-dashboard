"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { MarketData } from "@/lib/types/crypto";
import {
  formatCurrency,
  formatLargeNumber,
  formatPercentage,
  formatSupply,
} from "@/lib/utils/format";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  sparklineData?: number[];
  subtitle?: string;
}

function MetricCard({
  label,
  value,
  change,
  sparklineData,
  subtitle,
}: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const chartData =
    sparklineData?.map((price, index) => ({ value: price, index })) || [];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {change !== undefined && (
              <p
                className={`text-sm font-medium mt-1 ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {formatPercentage(change)}
              </p>
            )}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <div className="w-20 h-12 ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isPositive ? "#22c55e" : "#ef4444"}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MarketDataProps {
  coinId: string;
  initialMarketData: MarketData;
}

export function MarketData({ coinId, initialMarketData }: MarketDataProps) {
  const supplyPercentage =
    initialMarketData.totalSupply > 0
      ? (initialMarketData.circulatingSupply / initialMarketData.totalSupply) *
        100
      : 100;

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Market data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          label="Market cap"
          value={formatLargeNumber(initialMarketData.marketCap)}
        />
        <MetricCard label="Rank" value={`#${initialMarketData.rank}`} />
        <MetricCard
          label="24H volume"
          value={formatLargeNumber(initialMarketData.volume24h)}
        />
        <MetricCard
          label="Circulating supply"
          value={`${formatSupply(initialMarketData.circulatingSupply)} ${coinId.toUpperCase()}`}
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
          value={`${formatSupply(initialMarketData.totalSupply)} ${coinId.toUpperCase()}`}
        />
      </div>
    </div>
  );
}
