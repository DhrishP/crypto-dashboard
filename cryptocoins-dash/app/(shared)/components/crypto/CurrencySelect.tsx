"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

const OPTIONS = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD"] as const;

interface CurrencySelectProps {
  value: string;
}

export function CurrencySelect({ value }: CurrencySelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const current = (value || "USD").toUpperCase();

  const paramsString = useMemo(() => {
    const p = new URLSearchParams(searchParams.toString());
    return p;
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <>
      <select
        className="h-9 rounded-md border border-border bg-background text-foreground px-3 text-sm cursor-pointer disabled:opacity-50"
        value={current}
        disabled={isLoading}
        onChange={(e) => {
          const vs = e.target.value.toLowerCase();
          setIsLoading(true);
          const p = new URLSearchParams(paramsString.toString());
          p.set("vs", vs);
          router.push(`?${p.toString()}`);
        }}
      >
        {OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-r-primary border-b-primary border-l-primary border-t-transparent border-b-0 border-r-0 rounded-full animate-spin" />
            <p className="text-foreground font-medium">
              Loading currency data...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
