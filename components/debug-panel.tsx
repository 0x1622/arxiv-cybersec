"use client"

import { useState } from "react"
import { Code, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearch } from "@/components/search-provider"

interface DebugPanelProps {
  data: Record<string, any>
}

export function DebugPanel({ data }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { debugMode } = useSearch()

  if (!debugMode) {
    return null
  }

  return (
    <div className="space-y-4">
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Debug Mode Enabled</AlertTitle>
        <AlertDescription>
          This mode is for development purposes only. It shows additional information about API requests and responses.
        </AlertDescription>
      </Alert>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-md border bg-muted/40 px-4 py-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">API Request Information</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <Code className="mr-2 h-4 w-4" />
              {isOpen ? "Hide" : "Show"} Details
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-2">
          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-medium">Request Parameters</h5>
              <pre className="mt-1 rounded-md bg-muted p-4 text-xs">
                {JSON.stringify(
                  {
                    search_query: buildSearchQueryString(data),
                    start: data.startIndex,
                    max_results: data.itemsPerPage,
                    sortBy: "relevance",
                    sortOrder: "descending",
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            <div>
              <h5 className="text-xs font-medium">Response Summary</h5>
              <pre className="mt-1 rounded-md bg-muted p-4 text-xs">
                {JSON.stringify(
                  {
                    totalResults: data.totalResults,
                    currentPage: data.page,
                    totalPages: Math.ceil(data.totalResults / data.itemsPerPage),
                    resultsPerPage: data.itemsPerPage,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

// Helper function to build a readable search query string for debug display
function buildSearchQueryString(data: Record<string, any>): string {
  const { query, category, year } = data

  const parts = []

  if (query) {
    parts.push(`all:${query}`)
  }

  if (category) {
    parts.push(`cat:${category}`)
  }

  if (year) {
    parts.push(`submittedDate:[${year}0101 TO ${year}1231]`)
  }

  // Default to cybersecurity papers if no specific query
  if (parts.length === 0) {
    parts.push("cat:cs.CR")
  }

  return parts.join(" AND ")
}
