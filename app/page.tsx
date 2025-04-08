import { SearchForm } from "@/components/search-form"
import { CategoryTags } from "@/components/category-tags"
import { YearFilter } from "@/components/year-filter"
import { searchPapers } from "@/lib/arxiv"
import { InfiniteScrollPapers } from "@/components/infinite-scroll-papers"
import Link from 'next/link'

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse search parameters
  const query = (searchParams?.q as string) || "";
  const year = searchParams?.year as string | undefined;
  const category = (searchParams?.category as string) || "cs.CR";
  const tag = searchParams?.tag as string | undefined;
  const page = 1; // Always fetch page 1 initially
  
  // Fetch only the FIRST page of search results
  const { papers: initialPapers, totalResults } = await searchPapers({
    query,
    year,
    category,
    tag,
    page,
  });

  // Create a simplified searchParams object for the client component
  const clientSearchParams = {
    q: query,
    year,
    category,
    tag,
  };
  
  return (
    <div className="container max-w-[1920px] mx-auto px-4 py-8">
      <section className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-heading tracking-tight">CyberSec Research</h1>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
          Browse, search and filter the latest cybersecurity research papers from arXiv
        </p>
        <SearchForm className="mx-auto max-w-2xl" defaultValue={query} />
      </section>

      <section className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-heading">Filters</h2>
        </div>
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1">
            <CategoryTags 
              selectedCategory={category} 
              selectedTag={tag}
            />
          </div>
          <div className="w-48">
            <YearFilter selectedYear={year} />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-heading">
            {query || year || tag || category !== 'cs.CR' ? `Results (${totalResults})` : `Latest Cybersecurity Research (${totalResults})`}
          </h2>
        </div>

        {initialPapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mb-2 text-xl font-medium">No results found</h3>
            <p className="mb-6 text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              Clear filters and return home
            </Link>
          </div>
        ) : (
          <InfiniteScrollPapers 
            initialPapers={initialPapers} 
            initialTotalResults={totalResults} 
            searchParams={clientSearchParams} 
          />
        )}
      </section>
    </div>
  )
}
