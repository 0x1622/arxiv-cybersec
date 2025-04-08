import { NextResponse } from "next/server"

// Add proper static export configuration
export const dynamic = "force-static"
export const revalidate = false

export async function GET() {
  // For static export, we return a fixed response
  // This is a fallback value that will be used for static generation
  // In a real app with static export, you might want to pre-compute 
  // different counts for common queries and provide them as static files
  
  return NextResponse.json({ 
    totalResults: 100, // Fallback count
    isStaticFallback: true 
  })
} 