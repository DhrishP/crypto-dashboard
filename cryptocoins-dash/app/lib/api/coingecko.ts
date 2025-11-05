import {
  CoinData,
  CoinInfo,
  HistoricalData,
  MarketData,
} from "@/lib/types/crypto";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

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

async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      next: { revalidate: 30 },
    });

    if (!response.ok) {
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

export async function getCoinData(id: string): Promise<CoinData> {
  const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=24h%2C7d`;

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
  days: number = 7
): Promise<HistoricalData> {
  const url = `${COINGECKO_API_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${
    days <= 1 ? "hourly" : days <= 7 ? "hourly" : "daily"
  }`;

  return await fetchWithErrorHandling<HistoricalData>(url);
}

export async function getCoinMarketData(id: string): Promise<MarketData> {
  const coinInfo = await getCoinInfo(id);
  const marketData = coinInfo.market_data;

  return {
    marketCap: marketData.market_cap.usd,
    rank: marketData.market_cap_rank || 0,
    volume24h: marketData.total_volume.usd,
    circulatingSupply: marketData.circulating_supply || 0,
    totalSupply: marketData.total_supply || marketData.circulating_supply || 0,
    ath: marketData.ath.usd,
    athChangePercentage: marketData.ath_change_percentage.usd,
    atl: marketData.atl.usd,
    atlChangePercentage: marketData.atl_change_percentage.usd,
  };
}

export async function getBitcoinData(): Promise<HistoricalData> {
  return getHistoricalData("bitcoin", 7);
}

export { ApiError };
