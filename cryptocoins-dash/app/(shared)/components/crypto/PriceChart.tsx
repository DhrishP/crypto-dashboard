"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  HistoricalData,
  TimeRange,
  TIME_RANGE_DAYS,
  OHLCPoint,
} from "@/lib/types/crypto";
import {
  getHistoricalData,
  getBitcoinData,
  ApiError,
  getOHLCData,
} from "@/lib/api/coingecko";
import { TooltipProps } from "@/lib/types/tooltip";
import { TimeRangeSelector } from "@/components/crypto/TimeRangeSelector";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils/format";
import { CandlestickChart } from "@/components/crypto/CandlestickChart";

interface PriceChartProps {
  coinId: string;
  initialData: HistoricalData;
  currency?: string;
}

export function PriceChart({
  coinId,
  initialData,
  currency = "USD",
}: PriceChartProps) {
  const [chartData, setChartData] = useState<HistoricalData>(initialData);
  const [bitcoinData, setBitcoinData] = useState<HistoricalData | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>("24h");
  const [isCandlestick, setIsCandlestick] = useState(false);
  const [ohlc, setOhlc] = useState<OHLCPoint[] | null>(null);
  const [showBitcoin, setShowBitcoin] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchChartData = useCallback(
    async (range: TimeRange, retryCount = 0) => {
      try {
        setLoading(true);
        if (isCandlestick) {
          const mapRange = (r: TimeRange): 1 | 7 | 14 | 30 | 90 | 180 | 365 => {
            switch (r) {
              case "1h":
              case "24h":
                return 1;
              case "7d":
                return 7;
              case "30d":
                return 30;
              case "90d":
                return 90;
              case "180d":
                return 180;
              case "365d":
              case "all":
              default:
                return 365;
            }
          };
          const raw = await getOHLCData(coinId, mapRange(range));
          const mapped: OHLCPoint[] = raw.map((p) => ({
            time: p[0],
            open: p[1],
            high: p[2],
            low: p[3],
            close: p[4],
          }));
          setOhlc(mapped);
        } else {
          const days = TIME_RANGE_DAYS[range];
          const coinData = await getHistoricalData(
            coinId,
            days,
            currency.toLowerCase()
          );
          setChartData(coinData);
        }
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.statusCode === 429 &&
          retryCount < 3
        ) {
          const waitTime = Math.pow(2, retryCount) * 5000;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          return fetchChartData(range, retryCount + 1);
        }
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to fetch chart data";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [coinId, isCandlestick, currency]
  );

  useEffect(() => {
    fetchChartData(selectedRange);
  }, [selectedRange, fetchChartData]);

  useEffect(() => {
    if (showBitcoin) {
      getBitcoinData()
        .then(setBitcoinData)
        .catch(() => {
          toast.error("Failed to fetch Bitcoin comparison data");
        });
    } else {
      setBitcoinData(null);
    }
  }, [showBitcoin]);

  const formatChartData = () => {
    return chartData.prices.map(([timestamp, price], index) => {
      const btcPrice = bitcoinData?.prices[index]?.[1];
      return {
        timestamp,
        date: new Date(timestamp).toLocaleDateString(),
        time: new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        price,
        btcPrice: btcPrice || null,
      };
    });
  };

  const data = formatChartData();
  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const priceRange = maxPrice - minPrice;
  const yAxisDomain = [
    minPrice - priceRange * 0.1,
    maxPrice + priceRange * 0.1,
  ];

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground mb-1">
            {payload[0].payload.date} {payload[0].payload.time}
          </p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(payload[0].value)}
          </p>
          {showBitcoin && payload[1] && (
            <p className="text-sm text-muted-foreground mt-1">
              BTC: {formatCurrency(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="h-[450px] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading chart data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {isCandlestick && ohlc ? (
              <CandlestickChart data={ohlc} />
            ) : (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={yAxisDomain}
                  orientation="right"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value, currency)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                {showBitcoin && bitcoinData && (
                  <Area
                    type="monotone"
                    dataKey="btcPrice"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
        <TimeRangeSelector
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
        <div className="flex gap-2">
          <Button
            variant={showBitcoin ? "default" : "outline"}
            size="sm"
            onClick={() => setShowBitcoin(!showBitcoin)}
            className={isCandlestick ? "hidden" : ""}
          >
            {showBitcoin ? "Hide" : "Show"} BTC Comparison
          </Button>
          <Button
            variant={isCandlestick ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCandlestick((s) => !s)}
          >
            {isCandlestick ? "Line" : "Candles"}
          </Button>
        </div>
      </div>
    </div>
  );
}
