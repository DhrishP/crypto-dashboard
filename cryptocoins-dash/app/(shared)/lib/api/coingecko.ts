import {
  CoinData,
  CoinInfo,
  HistoricalData,
  MarketData,
} from "@/lib/types/crypto";

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
const COINGECKO_API_TIER = process.env.COINGECKO_API_TIER || "demo"; 
const COINGECKO_API_BASE =
  COINGECKO_API_TIER === "pro"
    ? "https://pro-api.coingecko.com/api/v3"
    : "https://api.coingecko.com/api/v3";

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise((resolve) =>
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      );
    }
    
    lastRequestTime = Date.now();

    const headers: Record<string, string> = {
      ...((options?.headers as Record<string, string>) || {}),
    };

    if (COINGECKO_API_KEY) {
      if (COINGECKO_API_TIER === "pro") {
        headers["x-cg-pro-api-key"] = COINGECKO_API_KEY;
      } else {
        headers["x-cg-demo-api-key"] = COINGECKO_API_KEY;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        const waitTime = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : 60000;
        throw new ApiError(
          `Rate limit exceeded. Retry after ${waitTime / 1000} seconds`,
          429,
          "RATE_LIMIT"
        );
      }
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `API request failed: ${response.statusText}`,
        response.status,
        errorData.code
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Failed to fetch data",
      500,
      "NETWORK_ERROR"
    );
  }
}

export async function getCoinData(id: string, vsCurrency: string = "usd"): Promise<CoinData> {
  const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=${vsCurrency}&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=24h%2C7d`;

  const data = await fetchWithErrorHandling<CoinData[]>(url);

  if (!data || data.length === 0) {
    throw new ApiError(`Coin with id "${id}" not found`, 404, "COIN_NOT_FOUND");
  }

  return data[0];
}

export async function getCoinInfo(id: string): Promise<CoinInfo> {
  const url = `${COINGECKO_API_BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

  return await fetchWithErrorHandling<CoinInfo>(url);
}

export async function getHistoricalData(
  id: string,
  days: number | "max" = 7,
  vsCurrency: string = "usd"
): Promise<HistoricalData> {
  const url = `${COINGECKO_API_BASE}/coins/${id}/market_chart?vs_currency=${vsCurrency}&days=${days}`;

  return await fetchWithErrorHandling<HistoricalData>(url);
}

export async function getOHLCData(
  id: string,
  days: 1 | 7 | 14 | 30 | 90 | 180 | 365
): Promise<[number, number, number, number, number][]> {
  const url = `${COINGECKO_API_BASE}/coins/${id}/ohlc?vs_currency=usd&days=${days}`;
  return await fetchWithErrorHandling<[number, number, number, number, number][]>(url);
}

export async function getCoinMarketData(id: string, vsCurrency: string = "usd"): Promise<MarketData> {
  const coinInfo = await getCoinInfo(id);
  const marketData = coinInfo.market_data;

  return {
    marketCap: marketData.market_cap[vsCurrency] ?? marketData.market_cap.usd,
    rank: marketData.market_cap_rank || 0,
    volume24h: marketData.total_volume[vsCurrency] ?? marketData.total_volume.usd,
    circulatingSupply: marketData.circulating_supply || 0,
    totalSupply: marketData.total_supply || marketData.circulating_supply || 0,
    ath: marketData.ath[vsCurrency] ?? marketData.ath.usd,
    athChangePercentage: marketData.ath_change_percentage[vsCurrency] ?? marketData.ath_change_percentage.usd,
    atl: marketData.atl[vsCurrency] ?? marketData.atl.usd,
    atlChangePercentage: marketData.atl_change_percentage[vsCurrency] ?? marketData.atl_change_percentage.usd,
  };
}

export async function getBitcoinData(): Promise<HistoricalData> {
  return getHistoricalData("bitcoin", 7);
}

export { ApiError };
