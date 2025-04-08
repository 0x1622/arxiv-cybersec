import { searchPapers } from "@/lib/arxiv"
import { NextRequest, NextResponse } from "next/server"

// Add proper static export configuration
export const dynamic = "force-static"
export const revalidate = false

export async function GET(request: NextRequest) {
  // Get the URL search params
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const year = searchParams.get("year") || undefined
  const category = searchParams.get("category") || "cs.CR"
  const tag = searchParams.get("tag") || undefined

  try {
    // Use searchPapers with page 1 to get total results count
    const { totalResults } = await searchPapers({
      query,
      year,
      category,
      tag,
      page: 1,
    })

    // Return the total results count
    return NextResponse.json({ totalResults })
  } catch (error) {
    console.error("Error getting paper count:", error)
    return NextResponse.json({ totalResults: 0 }, { status: 500 })
  }
} 