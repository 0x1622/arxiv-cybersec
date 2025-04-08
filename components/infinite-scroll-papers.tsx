'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import { PaperCard } from "@/components/paper-card";
import type { Paper, SearchResponse } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface InfiniteScrollPapersProps {
  initialPapers: Paper[];
  initialTotalResults: number;
  searchParams: { // Pass search params from server component
    q?: string;
    year?: string;
    category?: string;
    tag?: string;
  };
}

export function InfiniteScrollPapers({
  initialPapers,
  initialTotalResults,
  searchParams: serverSearchParams // Rename to avoid conflict with hook
}: InfiniteScrollPapersProps) {
  const [papers, setPapers] = useState<Paper[]>(initialPapers);
  const [page, setPage] = useState<number>(2); // Start loading from page 2
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(initialPapers.length < initialTotalResults);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Effect to reset state when initial papers change (e.g., due to new search)
  useEffect(() => {
    setPapers(initialPapers);
    setPage(2);
    setHasMore(initialPapers.length < initialTotalResults);
  }, [initialPapers, initialTotalResults]);

  const loadMorePapers = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (serverSearchParams.q) params.set('q', serverSearchParams.q);
      if (serverSearchParams.year) params.set('year', serverSearchParams.year);
      if (serverSearchParams.category) params.set('category', serverSearchParams.category);
      if (serverSearchParams.tag) params.set('tag', serverSearchParams.tag);
      params.set('page', page.toString());

      const response = await fetch(`/api/papers/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data: SearchResponse = await response.json();

      // Append new papers
      setPapers((prevPapers) => [...prevPapers, ...data.papers]);
      setPage((prevPage) => prevPage + 1);

      // Update hasMore based on the total results from the API response
      setHasMore((papers.length + data.papers.length) < data.totalResults);

    } catch (error) {
      console.error("Failed to load more papers:", error);
      setHasMore(false); // Stop trying if there's an error
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, papers.length, serverSearchParams]); // papers.length ensures recalculation when papers state updates

  // Effect for intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Check if the loader element is intersecting (visible)
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePapers();
        }
      },
      { threshold: 1.0 } // Adjust threshold as needed
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [loadMorePapers, hasMore, loading]); // Dependencies for the observer effect

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>

      {/* Loader and End Message */}
      <div ref={loaderRef} className="flex justify-center items-center py-10 h-16">
        {loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {!loading && !hasMore && papers.length > 0 && (
          <span className="text-muted-foreground">You've reached the end.</span>
        )}
        {/* Optional: Add a small buffer element or adjust threshold if loading triggers too early/late */}
      </div>
    </div>
  );
} 