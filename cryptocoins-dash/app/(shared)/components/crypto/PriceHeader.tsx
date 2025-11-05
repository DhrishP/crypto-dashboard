"use client";

import Image from "next/image";
import { CoinData } from "@/lib/types/crypto";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { useEffect, useState } from "react";
import { getCoinData, ApiError } from "@/lib/api/coingecko";
import { toast } from "sonner";

interface PriceHeaderProps {
  coinData: CoinData;
  initialPrice: number;
  initialChange: number;
  coinId: string;
  currency?: string;
}

export function PriceHeader({
  coinData,
  initialPrice,
  initialChange,
  coinId,
  currency = "USD",
}: PriceHeaderProps) {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(initialChange);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPrice(initialPrice);
    setChange(initialChange);
  }, [initialPrice, initialChange]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setLoading(true);
        const updatedData = await getCoinData(coinId, currency.toLowerCase());
        setPrice(updatedData.current_price);
        setChange(updatedData.price_change_percentage_24h);
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.statusCode === 429
        ) {
          toast.error("Rate limit exceeded", {
            description: "Updates paused temporarily. Please wait.",
          });
          return;
        }
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to update price data";
        toast.error(errorMessage, {
          description: "Failed to update price data",
        });
      } finally {
        setLoading(false);
      }
    }, 90000);

    return () => clearInterval(interval);
  }, [coinId, currency]);

  const isPositive = change >= 0;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
        <Image
          src={coinData.image}
          alt={coinData.name}
          width={48}
          height={48}
          className="rounded-full"
        />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold text-foreground">
            {coinData.name}{" "}
          <span className="text-muted-foreground font-normal">
              {coinData.symbol.toUpperCase()}
            </span>
          </h2>
        </div>

      <div className="text-5xl font-bold text-foreground mb-2">
        {formatCurrency(price, currency)}
      </div>

        <div
        className={`text-lg font-medium ${
          isPositive ? "text-emerald-500" : "text-red-500"
        }`}
        >
        {isPositive ? "+" : ""}{formatPercentage(change)}
      </div>
    </div>
  );
}
