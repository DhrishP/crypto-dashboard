"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getCryptoNews, NewsApiError } from "@/lib/api/news";
import { NewsItem } from "@/lib/types/crypto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface NewsSectionProps {
  coinId: string;
  initialNews: NewsItem[];
}

export function NewsSection({ coinId, initialNews }: NewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const newsData = await getCryptoNews(coinId);
      setNews(newsData);
    } catch (error) {
      if (!(error instanceof NewsApiError)) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch news";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [coinId, toast]);

  useEffect(() => {
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  if (news.length === 0 && !loading) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              {item.thumb_2x && (
                <Image
                  src={item.thumb_2x}
                  alt={item.title}
                  width={800}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <CardTitle className="text-lg line-clamp-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {item.title}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                {item.description}
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{item.source || "Unknown"}</span>
                <span>{new Date(item.published_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {loading && (
        <div className="text-center text-muted-foreground mt-4">
          Loading news...
        </div>
      )}
    </div>
  );
}
