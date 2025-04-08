import Link from "next/link"
import { Calendar, ExternalLink, Tag, Users, HashIcon, BookOpen, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Paper } from "@/lib/types"
import { formatDate, truncateText } from "@/lib/utils"
import { CYBERSECURITY_TAGS } from "@/lib/types"

// Define tag colors
const tagColors: Record<string, string> = {
  'hardware': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'software': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'network': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'ai': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'ml': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  'cloud': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  'iot': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'malware': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  'crypto': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'privacy': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'authentication': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  'vulnerability': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

interface PaperCardProps {
  paper: Paper
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <Card className="transition-all hover:border-primary/50 flex flex-col h-[240px] overflow-hidden group">
      <CardHeader className="flex-none py-2 px-4">
        <CardTitle className="line-clamp-2 text-base leading-tight paper-title">
          <Link href={`/papers/${paper.id}`} className="hover:underline">
            {paper.title}
          </Link>
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{formatDate(paper.publishedDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 flex-shrink-0" />
            <span>{truncateText(paper.authors.join(", "), 40)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow py-1 px-4 min-h-0 overflow-hidden">
        <p className="line-clamp-2 text-xs text-muted-foreground">{paper.summary}</p>
        
        {paper.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {paper.tags.slice(0, 2).map((tagId) => {
              const tag = CYBERSECURITY_TAGS.find(t => t.id === tagId);
              const colorClass = tagColors[tagId] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
              return (
                <Link href={`/?tag=${tagId}`} key={tagId}>
                  <Badge variant="outline" className={`flex items-center gap-1 text-xs border-0 ${colorClass}`}>
                    <HashIcon className="h-2 w-2 flex-shrink-0" />
                    {tag?.name || tagId}
                  </Badge>
                </Link>
              );
            })}
            {paper.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">+{paper.tags.length - 2}</Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-none flex flex-col items-start gap-1 py-2 px-4">
        <div className="flex flex-wrap gap-1 w-full">
          {paper.categories.slice(0, 1).map((category) => (
            <Link href={`/?category=${category}`} key={category} className="inline-block max-w-full">
              <Badge variant="secondary" className="flex items-center gap-1 text-xs overflow-hidden text-ellipsis">
                <Tag className="h-2 w-2 flex-shrink-0" />
                <span className="truncate">{category}</span>
              </Badge>
            </Link>
          ))}
          {paper.categories.length > 1 && <Badge variant="outline" className="text-xs">+{paper.categories.length - 1}</Badge>}
        </div>
        <div className="flex gap-1 w-full mt-auto">
          <Link 
            href={`/papers/${paper.id}`}
            className="flex-1 flex items-center justify-center gap-1 text-xs h-6 px-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring relative overflow-hidden group-hover:border-primary font-heading"
          >
            <BookOpen className="h-3 w-3 flex-shrink-0" />
            <span>Read Article</span>
            <ArrowUpRight className="h-3 w-3 flex-shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all absolute right-2" />
          </Link>
          <Button size="sm" variant="outline" className="text-xs h-6 px-2" asChild>
            <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
              PDF
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
