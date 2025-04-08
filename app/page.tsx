import { SearchForm } from "@/components/search-form"
import { LatestPapers } from "@/components/latest-papers"
import { CategoryTags } from "@/components/category-tags"
import { YearFilter } from "@/components/year-filter"
import { CYBERSECURITY_CATEGORIES, CYBERSECURITY_TAGS } from "@/lib/types"
import { Pagination } from "@/components/pagination"
import { searchPapers } from "@/lib/arxiv"
import { PaperCard } from "@/components/paper-card"

export default async function Home({
  params,
  searchParams,
}: {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse search parameters, providing defaults and handling potential arrays
  const query = (searchParams?.q as string) || "";
  const year = searchParams?.year as string | undefined;
  const category = (searchParams?.category as string) || "cs.CR"; // Default to Cryptography and Security
  const tag = searchParams?.tag as string | undefined;
  const page = searchParams?.page ? parseInt(searchParams.page as string) : 1;
  
  // Fetch search results directly to get pagination data
  const { papers, totalResults, startIndex, itemsPerPage } = await searchPapers({
    query,
    year,
    category,
    tag,
    page,
  });
  
  // Calculate total pages
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  
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
            {query || year || tag ? "Search Results" : "Latest Cybersecurity Research"}
          </h2>
          {/* Optional: Display result count? e.g., <span className="text-muted-foreground">({totalResults} papers found)</span> */} 
        </div>
        {/* Render papers directly */} 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
          {papers.reverse().map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>

        {/* Add Pagination component if there are results */} 
        {totalResults > 0 && (
          <div className="mt-8 flex justify-center">
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
