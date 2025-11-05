import { NewsItem } from "@/lib/types/crypto";

const COINGECKO_NEWS_API = "https://api.coingecko.com/api/v3/news";

class NewsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "NewsApiError";
  }
}

export async function getCryptoNews(coinId?: string): Promise<NewsItem[]> {
  try {
    const url = coinId
      ? `${COINGECKO_NEWS_API}?feeds=coindesk&${coinId}`
      : `${COINGECKO_NEWS_API}?feeds=coindesk`;

    const response = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new NewsApiError(
        `Failed to fetch news: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.slice(0, 10);
  } catch (error) {
    if (error instanceof NewsApiError) {
      throw error;
    }
    throw new NewsApiError(
      error instanceof Error ? error.message : "Failed to fetch news"
    );
  }
}

export { NewsApiError };
