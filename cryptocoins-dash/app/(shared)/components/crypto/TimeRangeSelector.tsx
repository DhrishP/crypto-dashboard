"use client";

import { Button } from "@/components/ui/button";
import { TimeRange } from "@/lib/types/crypto";
import { cn } from "@/lib/utils/cn";

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: "1H", value: "1h" },
  { label: "24H", value: "24h" },
  { label: "1W", value: "7d" },
  { label: "1M", value: "30d" },
  { label: "3M", value: "90d" },
  { label: "6M", value: "180d" },
  { label: "1Y", value: "365d" },
  { label: "ALL", value: "all" },
];

export function TimeRangeSelector({
  selectedRange,
  onRangeChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {TIME_RANGES.map((range) => (
        <Button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          variant="outline"
          size="sm"
          className={cn(
            "h-8 rounded-full px-4 text-sm font-medium transition-all duration-200 cursor-pointer border-2",
            selectedRange === range.value
              ? "dark:bg-[#082a48] dark:text-[#00d9ff] dark:border-[#00d9ff] dark:shadow-[0_0_10px_rgba(0,217,255,0.45)] bg-[#e6f7ff] text-[#006a80] border-[#a6eaff] hover:bg-[#d2f3ff]"
              : "bg-transparent text-gray-700 border-gray-300 hover:bg-[#e6f7ff]/60 hover:text-[#006a80] hover:border-[#00bcd4] dark:text-gray-300 dark:border-[#00d9ff]/40 dark:hover:bg-[#082a48]/20 dark:hover:text-[#00d9ff] dark:hover:border-[#00d9ff] dark:hover:shadow-[0_0_8px_rgba(0,217,255,0.35)]"
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}
