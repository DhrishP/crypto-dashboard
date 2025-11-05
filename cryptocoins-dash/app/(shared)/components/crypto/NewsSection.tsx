"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getCryptoNews, NewsApiError } from "@/lib/api/news";
import { NewsItem } from "@/lib/types/crypto";
import { toast } from "sonner";

interface NewsSectionProps {
  coinId: string;
  symbol?: string;
  initialNews: NewsItem[];
}

export function NewsSection({ coinId, symbol, initialNews }: NewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const newsData = await getCryptoNews({ coinId, symbol });
      setNews(newsData);
    } catch (error) {
      if (error instanceof NewsApiError && error.statusCode === 429) {
        toast.error("Rate limit exceeded", {
          description: "News updates paused temporarily.",
        });
        return;
      }
      if (!(error instanceof NewsApiError)) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch news.";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [coinId, symbol]);

  useEffect(() => {
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  if (news.length === 0 && !loading) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-8">Latest News</h2>
      <div className="space-y-4">
        {news.slice(0, visibleCount).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-border rounded-lg p-4 transition-all duration-300 bg-card cursor-pointer hover:bg-accent/30 group"
          >
            <div className="flex gap-4 items-start">
              {item.thumb_2x ? (
                <Image
                  src={item.thumb_2x}
                  alt={item.title}
                  width={160}
                  height={96}
                  unoptimized
                  className="w-40 h-24 object-cover rounded-md shrink-0"
                />
              ) : (
                <div className="w-40 h-24 rounded-md shrink-0 bg-muted flex items-center justify-center border border-border">
                  <p className="text-xs text-muted-foreground text-center px-2">
                    No image available
                  </p>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold group-hover:text-teal-400 line-clamp-2 text-white transition-colors flex-1">
                    {item.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                    {new Date(item.published_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                  {item.description}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <span>{item.source || "Unknown"}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      {visibleCount < news.length && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-accent/30 transition-colors cursor-pointer"
            onClick={() =>
              setVisibleCount(Math.min(visibleCount + 6, news.length))
            }
          >
            Load more
          </button>
        </div>
      )}
      {loading && (
        <div className="text-center text-muted-foreground mt-4">
          Loading news...
        </div>
      )}
    </div>
  );
}
