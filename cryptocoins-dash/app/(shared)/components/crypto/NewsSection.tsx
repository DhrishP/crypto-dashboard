"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getCryptoNews, NewsApiError } from "@/lib/api/news";
import { NewsItem } from "@/lib/types/crypto";
import { toast } from "sonner";

interface NewsSectionProps {
  coinId: string;
  initialNews: NewsItem[];
}

export function NewsSection({ coinId, initialNews }: NewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const newsData = await getCryptoNews({ coinId });
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
  }, [coinId]);

  useEffect(() => {
    const interval = setInterval(fetchNews, 180000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  if (news.length === 0 && !loading) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-8">
        Latest News
      </h2>
      <div className="space-y-4">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-border rounded-lg p-4 transition-all duration-300 bg-card cursor-pointer hover:bg-accent/30 group"
          >
            <div className="flex gap-4 items-start">
              {item.thumb_2x && (
                <Image
                  src={item.thumb_2x}
                  alt={item.title}
                  width={160}
                  height={96}
                  className="w-40 h-24 object-cover rounded-md flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <h3 className="text-base font-semibold group-hover:text-teal-400 line-clamp-2 text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                {item.description}
              </p>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>{item.source || "Unknown"}</span>
                <span>{new Date(item.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      {loading && (
        <div className="text-center text-muted-foreground mt-4">Loading news...</div>
      )}
    </div>
  );
}
