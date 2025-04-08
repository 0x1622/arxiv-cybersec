"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useSearch } from "@/components/search-provider"
import { CYBERSECURITY_CATEGORIES, CYBERSECURITY_TAGS } from "@/lib/types"

interface SearchFiltersProps {
  selectedYear?: string
  selectedCategory?: string
  selectedTag?: string
}

const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"]

export function SearchFilters({ selectedYear, selectedCategory, selectedTag }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { debugMode, toggleDebugMode } = useSearch()

  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === null) {
      params.delete(name)
    } else {
      params.set(name, value)
    }

    // Reset to page 1 when filters change
    params.set("page", "1")

    return params.toString()
  }

  const handleYearChange = (year: string) => {
    const newYear = selectedYear === year ? null : year
    
    // Get all current parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // Update the year parameter
    if (newYear === null) {
      params.delete("year")
    } else {
      params.set("year", newYear)
    }
    
    // Reset to page 1 when filters change
    params.set("page", "1")
    
    // Navigate to new URL
    router.push(`/search?${params.toString()}`)
  }

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    
    // Get all current parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // Update the category parameter (default to cs.CR if clearing)
    if (newCategory === null) {
      params.set("category", "cs.CR")
    } else {
      params.set("category", newCategory)
    }
    
    // Reset to page 1 when filters change
    params.set("page", "1")
    
    // Navigate to new URL
    router.push(`/search?${params.toString()}`)
  }

  const handleTagChange = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag
    
    // Get all current parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // Update the tag parameter
    if (newTag === null) {
      params.delete("tag")
    } else {
      params.set("tag", newTag)
    }
    
    // Reset to page 1 when filters change
    params.set("page", "1")
    
    // Navigate to new URL
    router.push(`/search?${params.toString()}`)
  }

  // Display the actual category name, defaulting to Cryptography and Security
  const displayCategory = CYBERSECURITY_CATEGORIES.find(
    (c) => c.id === (selectedCategory || "cs.CR")
  )?.name || "Cryptography and Security"

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Filters</h3>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Publication Year</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedYear || "Select Year"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Year</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {years.map((year) => (
                  <DropdownMenuCheckboxItem
                    key={year}
                    checked={selectedYear === year}
                    onCheckedChange={() => handleYearChange(year)}
                  >
                    {year}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Category</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {displayCategory}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {CYBERSECURITY_CATEGORIES.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={selectedCategory === category.id || (!selectedCategory && category.id === "cs.CR")}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Tags</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {CYBERSECURITY_TAGS.find((t) => t.id === selectedTag)?.name || "Select Tag"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {CYBERSECURITY_TAGS.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTag === tag.id}
                    onCheckedChange={() => handleTagChange(tag.id)}
                  >
                    {tag.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="debug-mode" checked={debugMode} onCheckedChange={toggleDebugMode} />
        <Label htmlFor="debug-mode">Debug Mode</Label>
      </div>
    </div>
  )
}
