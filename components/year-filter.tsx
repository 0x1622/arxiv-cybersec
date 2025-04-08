"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface YearFilterProps {
  selectedYear?: string
}

const years = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010"]

export function YearFilter({ selectedYear }: YearFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleYearChange = (year: string) => {
    // Get all current parameters
    const params = new URLSearchParams(searchParams.toString())
    
    // If the current year is already selected, clear it, otherwise set it
    if (params.get('year') === year) {
      params.delete('year')
    } else {
      params.set('year', year)
    }
    
    // Navigate to home with updated params
    router.push(`/?${params.toString()}`)
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">Publication Year</h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedYear || "All Years"}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Filter by Year</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selectedYear} onValueChange={handleYearChange}>
            {years.map((year) => (
              <DropdownMenuRadioItem key={year} value={year}>
                {year}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 