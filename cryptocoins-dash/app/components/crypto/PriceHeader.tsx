"use client";

import Image from "next/image";
import { CoinData } from "@/lib/types/crypto";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { useEffect, useState } from "react";
import { getCoinData, ApiError } from "@/lib/api/coingecko";
import { useToast } from "@/components/ui/use-toast";

interface PriceHeaderProps {
  coinData: CoinData;
  initialPrice: number;
  initialChange: number;
  coinId: string;
}

export function PriceHeader({
  coinData,
  initialPrice,
  initialChange,
  coinId,
}: PriceHeaderProps) {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(initialChange);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setPrice(initialPrice);
    setChange(initialChange);
  }, [initialPrice, initialChange]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setLoading(true);
        const updatedData = await getCoinData(coinId);
        setPrice(updatedData.current_price);
        setChange(updatedData.price_change_percentage_24h);
      } catch (error) {
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to update price data";
        toast({
          title: "Update Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [coinId, toast]);

  const isPositive = change >= 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <Image
          src={coinData.image}
          alt={coinData.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {coinData.name}{" "}
            <span className="text-lg text-muted-foreground">
              {coinData.symbol.toUpperCase()}
            </span>
          </h2>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="text-4xl font-bold text-foreground">
            {formatCurrency(price)}
          </div>
          {loading && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <div
          className={`text-lg font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {formatPercentage(change)}
        </div>
      </div>
    </div>
  );
}
