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
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 rounded-full px-4 text-sm font-medium transition-colors",
            selectedRange === range.value
              ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}
