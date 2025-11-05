import { NewsItem } from "@/lib/types/crypto";

const CRYPTO_NEWS_API_KEY = process.env.CRYPTO_NEWS_API_KEY;

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

function normalizeDate(input?: string): string {
  if (!input) return new Date().toISOString();
  const parsed = Date.parse(input);
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  const num = Number(input);
  if (!Number.isNaN(num)) {
    const ms = input.length === 10 ? num * 1000 : num;
    return new Date(ms).toISOString();
  }
  return new Date().toISOString();
}

export async function getCryptoNews(
  options?: GetNewsOptions
): Promise<NewsItem[]> {
  try {
    if (!CRYPTO_NEWS_API_KEY) {
      throw new NewsApiError("CRYPTO_NEWS_API_KEY is not configured");
    }

    const query = (options?.coinId || options?.symbol || "crypto").toString();

    const to = new Date();
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const qs = new URLSearchParams({
      apikey: CRYPTO_NEWS_API_KEY,
      q: query,
      from: from.toISOString(),
      to: to.toISOString(),
      size: "20",
      langs: "en",
    });
    const url = `https://api.thenewsapi.net/crypto?${qs.toString()}`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) {
      throw new NewsApiError(
        `Failed to fetch TheNewsAPI: ${res.statusText}`,
        res.status
      );
    }
    interface TheNewsAPIResponse {
      success?: boolean;
      data?: { results?: unknown[] } | unknown[];
      results?: unknown[];
    }

    interface NewsAPIItem {
      id?: string | number;
      uuid?: string;
      title?: string;
      description?: string;
      excerpt?: string;
      url?: string;
      published_at?: string;
      created_at?: string;
      source?: string | { name?: string; domain?: string };
      domain?: string;
      author?: string;
      image_url?: string;
      image?: string;
      thumbnail?: string;
    }

    const body = (await res.json()) as unknown as TheNewsAPIResponse;
    let items: unknown[] = [];
    if (
      typeof body?.data === "object" &&
      body.data !== null &&
      !Array.isArray(body.data) &&
      "results" in body.data
    ) {
      const dataResults = (body.data as { results?: unknown[] }).results;
      if (Array.isArray(dataResults)) {
        items = dataResults;
      }
    } else if (Array.isArray(body?.results)) {
      items = body.results;
    } else if (Array.isArray(body?.data)) {
      items = body.data;
    }

    const mapped: NewsItem[] = (items as NewsAPIItem[]).map(
      (n: NewsAPIItem) => {
        const sourceName =
          typeof n.source === "string"
            ? n.source
            : (n?.source?.name ?? n?.domain ?? n?.author ?? undefined);
        return {
          id: String(n.id ?? n.uuid ?? n.url ?? n.title ?? Math.random()),
          title: n.title ?? "",
          description: n.description ?? n.excerpt ?? "",
          url: n.url ?? "#",
          published_at: normalizeDate(n.published_at ?? n.created_at),
          source: sourceName,
          thumb_2x: n.image_url ?? n.image ?? n.thumbnail ?? undefined,
        };
      }
    );
    return mapped;
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
