"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const OPTIONS = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD"] as const;

interface CurrencySelectProps {
  value: string;
}

export function CurrencySelect({ value }: CurrencySelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = (value || "USD").toUpperCase();

  const paramsString = useMemo(() => {
    const p = new URLSearchParams(searchParams.toString());
    return p;
  }, [searchParams]);

  return (
    <select
      className="h-9 rounded-md border border-border bg-background text-foreground px-3 text-sm cursor-pointer"
      value={current}
      onChange={(e) => {
        const vs = e.target.value.toLowerCase();
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
  );
}


