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

// Create fallback papers for static export
const fallbackPapers: Paper[] = [
  {
    id: "2104.02767",
    title: "Automatic Security Vulnerability Detection in Smart Contracts",
    authors: ["John Doe", "Jane Smith"],
    summary: "This paper presents a novel approach to automatically detect security vulnerabilities in smart contracts using static analysis techniques.",
    publishedDate: "2021-04-06T00:00:00Z",
    lastUpdatedDate: "2021-04-08T00:00:00Z", 
    categories: ["cs.CR"],
    pdf_url: "https://arxiv.org/pdf/2104.02767.pdf",
    tags: ["security", "vulnerability"],
  },
  {
    id: "2307.09658",
    title: "Advancements in Zero-Knowledge Proof Systems",
    authors: ["Alice Johnson", "Bob Williams"],
    summary: "We explore recent advancements in zero-knowledge proof systems and their applications in privacy-preserving technologies.",
    publishedDate: "2023-07-18T00:00:00Z",
    lastUpdatedDate: "2023-07-20T00:00:00Z",
    categories: ["cs.CR"],
    pdf_url: "https://arxiv.org/pdf/2307.09658.pdf",
    tags: ["crypto", "privacy"],
  },
];

export async function LatestPapers({ query, year, category, tag, page = 1 }: LatestPapersProps) {
  // For static export, use fallback data
  if (process.env.NEXT_STATIC_EXPORT) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {fallbackPapers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    );
  }
  
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
