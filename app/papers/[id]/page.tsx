import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Download, ExternalLink, Tag, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getPaperById } from "@/lib/arxiv"
import { formatDate } from "@/lib/utils"

interface PaperPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PaperPageProps): Promise<Metadata> {
  try {
    const paper = await getPaperById(params.id)

    return {
      title: `${paper.title} | Cybersec Research`,
      description: paper.summary.substring(0, 160),
    }
  } catch (error) {
    return {
      title: "Paper Not Found | Cybersec Research",
      description: "The requested paper could not be found",
    }
  }
}

export default async function PaperPage({ params }: PaperPageProps) {
  try {
    const paper = await getPaperById(params.id)

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to search
            </Link>
          </Button>
        </div>

        <article className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{paper.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Published: {formatDate(paper.publishedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Last Updated: {formatDate(paper.lastUpdatedDate)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">Authors:</span>
              <span>{paper.authors.join(", ")}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Abstract</h2>
            <p className="leading-relaxed text-muted-foreground">{paper.summary}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {paper.categories.map((category) => (
                <Link href={`/search?category=${category}`} key={category}>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`https://arxiv.org/abs/${params.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View on arXiv
              </a>
            </Button>
          </div>
        </article>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
