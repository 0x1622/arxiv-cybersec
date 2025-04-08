"use client"

import { useEffect } from "react"
import { XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSearch } from "@/components/search-provider"

export function ApiStatusAlert() {
  const { apiRateLimited } = useSearch()

  // Log to console for debugging
  useEffect(() => {
    if (apiRateLimited) {
      console.warn("API rate limit reached. Requests are being throttled.")
    }
  }, [apiRateLimited])

  if (!apiRateLimited) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle>API Rate Limit Reached</AlertTitle>
      <AlertDescription>
        We've reached the arXiv API rate limit. Please wait a moment before making additional requests. Results may be
        incomplete or delayed.
      </AlertDescription>
    </Alert>
  )
}
