"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tag, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CYBERSECURITY_CATEGORIES, CYBERSECURITY_TAGS } from "@/lib/types"

// Sample counts for categories (in a real app, these would come from the API)
const categoryCounts = {
  "cs.CR": 1245,
  "cs.NI": 876,
  "cs.AI": 1532,
  "cs.CY": 654,
  "cs.DC": 432,
  "cs.SE": 789,
  "cs.LG": 921,
}

// Sample counts for tags
const tagCounts = {
  "hardware": 342,
  "software": 578,
  "network": 456,
  "ai": 324,
  "ml": 428,
  "cloud": 219,
  "iot": 187,
  "malware": 296,
  "crypto": 413,
  "privacy": 329,
  "authentication": 247,
  "vulnerability": 385,
}

interface CategoryTagsProps {
  showTags?: boolean
  selectedCategory?: string
  selectedTag?: string
}

export function CategoryTags({ showTags = true, selectedCategory, selectedTag }: CategoryTagsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParams = (key: string, value: string) => {
    // Get existing params
    const params = new URLSearchParams(searchParams.toString())
    
    // If the current value is already selected, clear it, otherwise set it
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    // Navigate to home with updated params
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {CYBERSECURITY_CATEGORIES.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="cursor-pointer px-3 py-2 hover:bg-accent"
            onClick={() => updateParams('category', category.id)}
          >
            <Tag className="mr-2 h-3 w-3" />
            {category.name}
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
              {categoryCounts[category.id as keyof typeof categoryCounts] || 0}
            </span>
          </Badge>
        ))}
      </div>

      {showTags && (
        <div className="flex flex-wrap gap-3">
          {CYBERSECURITY_TAGS.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTag === tag.id ? "secondary" : "outline"}
              className="cursor-pointer px-3 py-2 hover:bg-accent"
              onClick={() => updateParams('tag', tag.id)}
            >
              <Hash className="mr-2 h-3 w-3" />
              {tag.name}
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                {tagCounts[tag.id as keyof typeof tagCounts] || 0}
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
