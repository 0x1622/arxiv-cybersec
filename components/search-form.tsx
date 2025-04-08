"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearch } from "@/components/search-provider"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchFormProps {
  className?: string
  defaultValue?: string
}

export function SearchForm({ className, defaultValue = "" }: SearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setIsLoading, apiRateLimited } = useSearch()
  const [query, setQuery] = useState(defaultValue)
  const debouncedQuery = useDebounce(query, 500)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || apiRateLimited) return

    setIsLoading(true)
    
    // Get existing params
    const params = new URLSearchParams(searchParams.toString())
    
    // Update query parameter
    if (query.trim()) {
      params.set("q", query.trim())
    } else {
      params.delete("q")
    }
    
    // Navigate to home with search query
    router.push(`/?${params.toString()}`)

    // Reset loading state after a short delay to account for navigation
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search cybersecurity papers..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={apiRateLimited}
        />
        <Button type="submit" className="absolute right-0 top-0 rounded-l-none" disabled={apiRateLimited}>
          Search
        </Button>
      </div>
    </form>
  )
}
