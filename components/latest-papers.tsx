import { getLatestPapers } from "@/lib/arxiv"
import { PaperCard } from "@/components/paper-card"
import { searchPapers } from "@/lib/arxiv"
import { Paper } from "@/lib/types"

interface LatestPapersProps {
  query?: string
  year?: string
  category?: string
  tag?: string
  page?: number
}

export async function LatestPapers({ query, year, category, tag, page = 1 }: LatestPapersProps) {
  // If search parameters are provided, use searchPapers, otherwise use getLatestPapers
  const papers = query || year || tag 
    ? (await searchPapers({ query: query || "", year, category: category || "cs.CR", tag, page })).papers
    : await getLatestPapers(page);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  )
}
