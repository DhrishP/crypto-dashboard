"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToCSV, CSVExportData } from "@/lib/utils/csv";
import { CoinData, MarketData } from "@/lib/types/crypto";

interface ExportButtonProps {
  coinData: CoinData;
  marketData: MarketData;
  coinId: string;
}

export function ExportButton({
  coinData,
  marketData,
  coinId,
}: ExportButtonProps) {
  const handleExport = () => {
    const exportData: CSVExportData[] = [
      {
        "Coin Name": coinData.name,
        Symbol: coinData.symbol.toUpperCase(),
        "Current Price (USD)": coinData.current_price,
        "24h Change (%)": coinData.price_change_percentage_24h,
        "Market Cap (USD)": marketData.marketCap,
        Rank: marketData.rank,
        "24h Volume (USD)": marketData.volume24h,
        "Circulating Supply": marketData.circulatingSupply,
        "Total Supply": marketData.totalSupply,
        "All-Time High (USD)": marketData.ath,
        "ATH Change (%)": marketData.athChangePercentage,
        "All-Time Low (USD)": marketData.atl,
        "ATL Change (%)": marketData.atlChangePercentage,
        "Exported At": new Date().toISOString(),
      },
    ];

    exportToCSV(
      exportData,
      `${coinId}-data-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Export to CSV
    </Button>
  );
}
