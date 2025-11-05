"use client";

import { useAccount, useBalance } from "wagmi";
import {
  getTokenContractAddress,
  isEthereumToken,
} from "@/lib/config/token-contracts";

interface TokenBalanceProps {
  coinId: string;
  symbol: string;
}

export function TokenBalance({ coinId }: TokenBalanceProps) {
  const { address, isConnected } = useAccount();

  // Get contract address for this token
  // null = native ETH, string = ERC-20 token address, undefined = not supported
  const contractAddress = getTokenContractAddress(coinId);
  const isSupported = isEthereumToken(coinId);

  // Fetch balance using wagmi hook
  // If contractAddress is null, it fetches native ETH balance
  // If contractAddress is a string, it fetches ERC-20 token balance
  const {
    data: balance,
    isLoading,
    error,
  } = useBalance({
    address: address,
    token:
      contractAddress === null ? undefined : (contractAddress as `0x${string}`),
    query: {
      enabled: isConnected && isSupported, // Only fetch if connected and supported
    },
  });

  // Compact inline display for header
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/20 text-muted-foreground text-xs">
        <span className="text-xs">Connect wallet</span>
      </div>
    );
  }

  // If token not supported on Ethereum
  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/20 text-muted-foreground text-xs">
        <span>Balance: N/A</span>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/20 text-muted-foreground text-xs">
        <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-500/50 bg-red-500/10 text-red-500 text-xs">
        <span>Error</span>
      </div>
    );
  }

  // Success state - display balance
  if (balance) {
    const formattedBalance = parseFloat(balance.formatted).toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 4,
        minimumFractionDigits: balance.formatted.includes(".") ? 2 : 0,
      }
    );

    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card/50 backdrop-blur-sm">
        <div className="text-xs text-muted-foreground font-medium">
          Balance:
        </div>
        <div className="text-sm font-semibold text-foreground">
          {formattedBalance} {balance.symbol}
        </div>
      </div>
    );
  }

  return null;
}
