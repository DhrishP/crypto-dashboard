"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HistoricalData, TimeRange, TIME_RANGE_DAYS } from "@/lib/types/crypto";
import {
  getHistoricalData,
  getBitcoinData,
  ApiError,
} from "@/lib/api/coingecko";
import { TooltipProps } from "@/lib/types/tooltip";
import { TimeRangeSelector } from "@/components/crypto/TimeRangeSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils/format";

interface PriceChartProps {
  coinId: string;
  initialData: HistoricalData;
}

export function PriceChart({ coinId, initialData }: PriceChartProps) {
  const [chartData, setChartData] = useState<HistoricalData>(initialData);
  const [bitcoinData, setBitcoinData] = useState<HistoricalData | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>("24h");
  const [isCandlestick, setIsCandlestick] = useState(false);
  const [showBitcoin, setShowBitcoin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchChartData = useCallback(
    async (range: TimeRange) => {
      try {
        setLoading(true);
        const days = TIME_RANGE_DAYS[range];
        const coinData = await getHistoricalData(coinId, days);
        setChartData(coinData);
      } catch (error) {
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to fetch chart data";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [coinId, toast]
  );

  useEffect(() => {
    fetchChartData(selectedRange);
  }, [selectedRange, fetchChartData]);

  useEffect(() => {
    if (showBitcoin) {
      getBitcoinData()
        .then(setBitcoinData)
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to fetch Bitcoin comparison data",
            variant: "destructive",
          });
        });
    } else {
      setBitcoinData(null);
    }
  }, [showBitcoin, toast]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <TimeRangeSelector
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
        <div className="flex gap-2">
          <Button
            variant={showBitcoin ? "default" : "outline"}
            size="sm"
            onClick={() => setShowBitcoin(!showBitcoin)}
          >
            {showBitcoin ? "Hide" : "Show"} BTC Comparison
          </Button>
          <Button
            variant={isCandlestick ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCandlestick(!isCandlestick)}
          >
            {isCandlestick ? "Line" : "Candlestick"}
          </Button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {isCandlestick ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="time"
                  className="text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  domain={yAxisDomain}
                  className="text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
                {showBitcoin && bitcoinData && (
                  <Line
                    type="monotone"
                    dataKey="btcPrice"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="time"
                  className="text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  domain={yAxisDomain}
                  className="text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                {showBitcoin && bitcoinData && (
                  <Line
                    type="monotone"
                    dataKey="btcPrice"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Bitcoin"
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
