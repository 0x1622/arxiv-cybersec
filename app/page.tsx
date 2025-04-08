import { SearchForm } from "@/components/search-form"
import { LatestPapers } from "@/components/latest-papers"
import { CategoryTags } from "@/components/category-tags"
import { YearFilter } from "@/components/year-filter"
import { CYBERSECURITY_CATEGORIES, CYBERSECURITY_TAGS } from "@/lib/types"
import { Pagination } from "@/components/pagination"
import { searchPapers } from "@/lib/arxiv"

interface HomeProps {
  searchParams: {
    q?: string
    year?: string
    category?: string
    tag?: string
    page?: string
  }
}

export default async function Home({ searchParams }: HomeProps) {
  // Parse search parameters safely - we need to use safely accessed properties in Next.js 15.2
  const params = searchParams;
  const query = params?.q ?? "";
  const year = params?.year ?? undefined;
  const category = params?.category ?? "cs.CR"; // Default to Cryptography and Security
  const tag = params?.tag ?? undefined;
  const page = params?.page && !isNaN(parseInt(params.page)) 
    ? parseInt(params.page) 
    : 1;

  // Display title based on filters
  let pageTitle = "Latest Cybersecurity Research"
  
  if (query) pageTitle = `Results for "${query}"`
  if (tag) pageTitle = `${CYBERSECURITY_TAGS.find(t => t.id === tag)?.name || 'Tag'} Research`
  if (category !== "cs.CR") pageTitle = `${CYBERSECURITY_CATEGORIES.find(c => c.id === category)?.name || 'Category'} Research`
  if (year) pageTitle = `${year} ${pageTitle}`

  // Get the search results to get the total count
  const { totalResults } = await searchPapers({
    query,
    year,
    category,
    tag,
    page: 1
  });

  // Calculate total pages (default to at least 1 page)
  const itemsPerPage = 18;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

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
        <div className="mb-6">
          <h2 className="text-2xl font-heading">{pageTitle}</h2>
          {year && <p className="text-sm text-muted-foreground">Showing papers from {year}</p>}
        </div>
        <LatestPapers 
          query={query}
          year={year}
          category={category}
          tag={tag}
          page={page}
        />
        
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              totalItems={totalResults} 
            />
          </div>
        )}
      </section>
    </div>
  )
}
