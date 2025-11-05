"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { OHLCPoint } from "@/lib/types/crypto";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CandlestickChartProps {
  data: OHLCPoint[];
}

export function CandlestickChart({ data }: CandlestickChartProps) {
  const series = useMemo(
    () => [
      {
        name: "OHLC",
        data: data.map((d) => ({
          x: new Date(d.time),
          y: [d.open, d.high, d.low, d.close],
        })),
      },
    ],
    [data]
  );

  const options = useMemo(
    () => ({
      chart: {
        type: "candlestick",
        toolbar: { show: false },
        animations: { enabled: false },
        background: "transparent",
      },
      theme: {
        mode: document.documentElement.classList.contains("dark")
          ? "dark"
          : "light",
      },
      xaxis: {
        type: "datetime",
        labels: { show: true, style: { colors: "#94a3b8" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        tooltip: { enabled: true },
        labels: { style: { colors: "#94a3b8" } },
      },
      grid: {
        borderColor: "#2a2a2a",
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      plotOptions: {
        candlestick: {
          colors: { upward: "#16a34a", downward: "#ef4444" },
          wick: { useFillColor: true },
        },
      },
    }),
    []
  );

  return (
    <ApexChart
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options={options as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      series={series as any}
      type="candlestick"
      height={400}
    />
  );
}
