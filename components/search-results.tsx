import Link from "next/link"
import { PaperCard } from "@/components/paper-card"
import { Pagination } from "@/components/pagination"
import { DebugPanel } from "@/components/debug-panel"
import { searchPapers } from "@/lib/arxiv"

interface SearchResultsProps {
  query: string
  year?: string
  category?: string
  tag?: string
  page: number
}

export async function SearchResults({ query, year, category, tag, page }: SearchResultsProps) {
  const { papers, totalResults, startIndex, itemsPerPage } = await searchPapers({
    query,
    year,
    category,
    tag,
    page,
  })

  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-xl font-medium">No results found</h3>
        <p className="mb-6 text-muted-foreground">
          Try adjusting your search or filters to find what you're looking for.
        </p>
        <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          Return to home
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {totalResults} {totalResults === 1 ? "Result" : "Results"}
        </h2>
      </div>

      <DebugPanel
        data={{
          query,
          year,
          category,
          tag,
          page,
          totalResults,
          startIndex,
          itemsPerPage,
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {papers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={Math.ceil(totalResults / itemsPerPage)} totalItems={totalResults} />
    </div>
  )
}
