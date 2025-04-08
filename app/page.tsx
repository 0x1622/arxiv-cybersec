import { SearchForm } from "@/components/search-form"
import { LatestPapers } from "@/components/latest-papers"
import { CategoryTags } from "@/components/category-tags"
import { YearFilter } from "@/components/year-filter"
import { CYBERSECURITY_CATEGORIES, CYBERSECURITY_TAGS } from "@/lib/types"
import { Pagination } from "@/components/pagination"
import { searchPapers } from "@/lib/arxiv"

// Configure for static export with client-side data fetching
export const dynamic = 'force-static'
export const revalidate = false

// Generate minimal static paths
export function generateStaticParams() {
  return [
    // Home page without any params
    {}
  ]
}

// Define standard Next.js 15 page props types
type PageParams = { [key: string]: string | string[] | undefined };
type SearchParams = { [key: string]: string | string[] | undefined };

type Props = {
  params: PageParams;
  searchParams: SearchParams;
};

export default async function Home({ params, searchParams }: Props) {
  // Parse search parameters, providing defaults and handling potential arrays
  const query = (searchParams?.q as string) || "";
  const year = searchParams?.year as string | undefined;
  const category = (searchParams?.category as string) || "cs.CR"; // Default to Cryptography and Security
  const tag = searchParams?.tag as string | undefined;
  const page = searchParams?.page ? parseInt(searchParams.page as string) : 1;
  
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
          <h2 className="text-2xl font-heading">Latest Cybersecurity Research</h2>
        </div>
        <LatestPapers 
          query={query}
          year={year}
          category={category}
          tag={tag}
          page={page}
        />
      </section>
    </div>
  )
}
