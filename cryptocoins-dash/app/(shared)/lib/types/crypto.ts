export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  atl_change_percentage: number;
  price_change_percentage_7d_in_currency?: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  price: number;
  market_cap?: number;
  total_volume?: number;
}

export interface HistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface OHLCPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface MarketData {
  marketCap: number;
  rank: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  ath: number;
  athChangePercentage: number;
  atl: number;
  atlChangePercentage: number;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  published_at: string;
  source?: string;
  thumb_2x?: string;
}

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  image: {
    small: string;
    large: string;
  };
  market_data: {
    current_price: Record<string, number>;
    price_change_percentage_24h: number;
    market_cap: Record<string, number>;
    market_cap_rank: number;
    total_volume: Record<string, number>;
    circulating_supply: number;
    total_supply: number;
    ath: Record<string, number>;
    ath_change_percentage: Record<string, number>;
    atl: Record<string, number>;
    atl_change_percentage: Record<string, number>;
    price_change_percentage_7d_in_currency: Record<string, number>;
  };
}

export type TimeRange =
  | "1h"
  | "24h"
  | "7d"
  | "30d"
  | "90d"
  | "180d"
  | "365d"
  | "all";

export const TIME_RANGE_DAYS: Record<TimeRange, number | "max"> = {
  "1h": 1,
  "24h": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "180d": 180,
  "365d": 365,
  all: "max",
};
