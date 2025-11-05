import { NewsItem } from "@/lib/types/crypto";

const COINGECKO_NEWS_API = "https://api.coingecko.com/api/v3/news";
const CRYPTOPANIC_API_KEY = process.env.CRYPTOPANIC_API_KEY;

class NewsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "NewsApiError";
  }
}

interface GetNewsOptions {
  coinId?: string;
  symbol?: string;
}

interface CryptoPanicResponse {
  results?: CryptoPanicPost[];
}

interface CryptoPanicPost {
  id?: number;
  slug?: string;
  title?: string;
  domain?: string;
  source?: { title?: string };
  url?: string;
  published_at?: string;
  metadata?: { image?: string };
}

interface CoinGeckoNewsItem {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  link?: string;
  published_at?: string;
  created_at?: string;
  source?: string;
  author?: string;
  thumb_2x?: string;
  image_url?: string;
}

export async function getCryptoNews(
  options?: GetNewsOptions
): Promise<NewsItem[]> {
  try {
    if (CRYPTOPANIC_API_KEY && options?.symbol) {
      const qp = new URLSearchParams({
        auth: CRYPTOPANIC_API_KEY,
        currencies: options.symbol.toUpperCase(),
        kind: "news",
        public: "true",
      });
      const cpUrl = `https://cryptopanic.com/api/v1/posts/?${qp.toString()}`;
      const cpRes = await fetch(cpUrl, { next: { revalidate: 60 } });
      if (!cpRes.ok) {
        throw new NewsApiError(
          `Failed to fetch CryptoPanic: ${cpRes.statusText}`,
          cpRes.status
        );
      }
      const cpJson: CryptoPanicResponse = await cpRes.json();
      const posts: CryptoPanicPost[] = Array.isArray(cpJson?.results)
        ? cpJson.results
        : [];
      return posts.slice(0, 12).map((p: CryptoPanicPost) => ({
        id: String(p.id ?? p.slug ?? p.title ?? ""),
        title: p.title ?? "",
        description: p.domain ?? p.source?.title ?? "",
        url: p.url ?? "#",
        published_at: p.published_at ?? new Date().toISOString(),
        source: p.source?.title ?? p.domain ?? undefined,
        thumb_2x: p.metadata?.image ?? undefined,
      }));
    }

    // Fallback to general CoinGecko news
    const url = `${COINGECKO_NEWS_API}?page=1&per_page=20`;

    const response = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new NewsApiError(
        `Failed to fetch news: ${response.statusText}`,
        response.status
      );
    }

    const json: CoinGeckoNewsItem[] | { data?: CoinGeckoNewsItem[] } =
      await response.json();
    const items: CoinGeckoNewsItem[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];

    return items.slice(0, 10).map((it: CoinGeckoNewsItem) => ({
      id: String(it.id ?? it.slug ?? it.title ?? ""),
      title: it.title ?? "",
      description: it.description ?? it.content ?? "",
      url: it.url ?? it.link ?? "#",
      published_at:
        it.published_at ?? it.created_at ?? new Date().toISOString(),
      source: it.source ?? it.author ?? undefined,
      thumb_2x: it.thumb_2x ?? it.image_url ?? undefined,
    }));
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
