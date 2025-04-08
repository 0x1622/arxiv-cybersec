import { XMLParser } from "fast-xml-parser"
import type { Paper, SearchParams, SearchResponse } from "@/lib/types"

// Base URL for arXiv API
const ARXIV_API_URL = "https://export.arxiv.org/api/query"

// Function to extract cybersecurity tags from paper summary
function extractTags(summary: string): string[] {
  const tags: string[] = [];
  
  // Define keywords for each tag
  const tagKeywords = {
    hardware: ['hardware', 'device', 'circuit', 'fpga', 'microcontroller', 'chip'],
    software: ['software', 'application', 'program', 'code', 'vulnerability', 'exploit'],
    network: ['network', 'protocol', 'tcp', 'ip', 'routing', 'dns', 'packet', 'firewall'],
    ai: ['artificial intelligence', 'ai', 'neural network', 'chatgpt', 'llm'],
    ml: ['machine learning', 'ml', 'classification', 'clustering', 'training'],
    cloud: ['cloud', 'aws', 'azure', 'gcp', 'virtualization', 'container'],
    iot: ['iot', 'internet of things', 'smart device', 'smart home', 'embedded'],
    malware: ['malware', 'virus', 'worm', 'trojan', 'ransomware', 'spyware'],
    crypto: ['cryptography', 'encryption', 'decryption', 'cipher', 'hash', 'key'],
    privacy: ['privacy', 'anonymity', 'tracking', 'data protection', 'gdpr'],
    authentication: ['authentication', 'authorization', 'login', 'password', 'mfa'],
    vulnerability: ['vulnerability', 'exploit', 'cve', 'poc', 'patch', 'zero-day']
  };
  
  // Convert summary to lowercase for case-insensitive matching
  const lowercaseSummary = summary.toLowerCase();
  
  // Check for each tag's keywords in the summary
  Object.entries(tagKeywords).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => lowercaseSummary.includes(keyword))) {
      tags.push(tag);
    }
  });
  
  return tags;
}

// Parse arXiv API XML response
function parseArxivResponse(xmlData: string): {
  papers: Paper[]
  totalResults: number
} {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  })

  const result = parser.parse(xmlData)

  // Extract total results
  const totalResults = Number.parseInt(result.feed["opensearch:totalResults"]["#text"] || "0", 10)

  // Handle case when no results are found
  if (totalResults === 0) {
    return { papers: [], totalResults: 0 }
  }

  // Normalize entries to always be an array
  const entries = result.feed.entry ? (Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry]) : []

  // Map API response to our Paper type
  const papers: Paper[] = entries.map((entry: any) => {
    // Extract authors (handle both single and multiple authors)
    let authors: string[] = []
    if (entry.author) {
      if (Array.isArray(entry.author)) {
        authors = entry.author.map((author: any) => author.name)
      } else {
        authors = [entry.author.name]
      }
    }

    // Extract categories
    let categories: string[] = []
    if (entry.category) {
      if (Array.isArray(entry.category)) {
        categories = entry.category.map((cat: any) => cat["@_term"])
      } else {
        categories = [entry.category["@_term"]]
      }
    }

    // Extract ID (remove the 'http://arxiv.org/abs/' prefix)
    const id = entry.id.replace("http://arxiv.org/abs/", "")

    // Extract the summary
    const summary = entry.summary.replace(/\s+/g, " ").trim();
    
    // Generate tags based on paper summary
    const tags = extractTags(summary);

    return {
      id,
      title: entry.title.replace(/\s+/g, " ").trim(), // Clean up whitespace
      authors,
      summary,
      publishedDate: entry.published,
      lastUpdatedDate: entry.updated,
      categories,
      pdf_url: `https://arxiv.org/pdf/${id}.pdf`,
      tags,
    }
  })

  return { papers, totalResults }
}

// Build search query string based on parameters
function buildSearchQuery(params: SearchParams): string {
  const { query, year, category, tag } = params

  let searchQuery = ""

  // Add main search query
  if (query) {
    searchQuery = `all:${query}`
  }

  // Add category filter (default to Cryptography and Security if not specified)
  const categoryFilter = category || "cs.CR"
  searchQuery = searchQuery ? `${searchQuery} AND cat:${categoryFilter}` : `cat:${categoryFilter}`

  // Add year filter (convert to date range)
  if (year) {
    const startDate = `${year}0101`
    const endDate = `${year}1231`
    const dateQuery = `submittedDate:[${startDate} TO ${endDate}]`
    searchQuery = searchQuery ? `${searchQuery} AND ${dateQuery}` : dateQuery
  }

  // Add tag filter via title/abstract search if tag is specified
  if (tag) {
    const tagQuery = `(ti:"${tag}" OR abs:"${tag}")`
    searchQuery = searchQuery ? `${searchQuery} AND ${tagQuery}` : tagQuery
  }

  return searchQuery
}

// Function to search papers using arXiv API
export async function searchPapers({ query, year, category, tag, page = 1 }: SearchParams): Promise<SearchResponse> {
  try {
    // Calculate start index for pagination
    const itemsPerPage = 18 // Increased from 10 to 18 to fill the grid
    const startIndex = (page - 1) * itemsPerPage

    // Build search query
    const searchQuery = buildSearchQuery({ query, year, category, tag, page })

    // Build URL with parameters
    const url = new URL(ARXIV_API_URL)
    url.searchParams.append("search_query", searchQuery)
    url.searchParams.append("start", startIndex.toString())
    url.searchParams.append("max_results", itemsPerPage.toString())
    url.searchParams.append("sortBy", "submittedDate")
    url.searchParams.append("sortOrder", "descending")

    // Set proper headers
    const headers = {
      "User-Agent": "CyberArXiv/1.0 (https://github.com/your-username/cyber-arxiv; email@example.com)",
    }

    // Make request with exponential backoff retry logic
    const response = await fetchWithRetry(url.toString(), { headers })

    if (!response.ok) {
      throw new Error(`arXiv API error: ${response.status} ${response.statusText}`)
    }

    const xmlData = await response.text()
    const { papers, totalResults } = parseArxivResponse(xmlData)

    return {
      papers,
      totalResults,
      startIndex,
      itemsPerPage,
    }
  } catch (error) {
    console.error("Error searching papers:", error)

    // Return empty results on error
    return {
      papers: [],
      totalResults: 0,
      startIndex: 0,
      itemsPerPage: 18,
    }
  }
}

// Function to get a single paper by ID
export async function getPaperById(id: string): Promise<Paper> {
  try {
    // Build URL with parameters
    const url = new URL(ARXIV_API_URL)
    url.searchParams.append("id_list", id)

    // Set proper headers
    const headers = {
      "User-Agent": "CyberArXiv/1.0 (https://github.com/your-username/cyber-arxiv; email@example.com)",
    }

    // Make request with exponential backoff retry logic
    const response = await fetchWithRetry(url.toString(), { headers })

    if (!response.ok) {
      throw new Error(`arXiv API error: ${response.status} ${response.statusText}`)
    }

    const xmlData = await response.text()
    const { papers } = parseArxivResponse(xmlData)

    if (papers.length === 0) {
      throw new Error(`Paper with ID ${id} not found`)
    }

    return papers[0]
  } catch (error) {
    console.error("Error fetching paper by ID:", error)
    throw error
  }
}

// Function to get latest cybersecurity papers
export async function getLatestPapers(page = 1): Promise<Paper[]> {
  try {
    // Calculate start index for pagination
    const itemsPerPage = 18
    const startIndex = (page - 1) * itemsPerPage
    
    // Build URL with parameters
    const url = new URL(ARXIV_API_URL)
    url.searchParams.append("search_query", "cat:cs.CR")
    url.searchParams.append("start", startIndex.toString())
    url.searchParams.append("max_results", itemsPerPage.toString())
    url.searchParams.append("sortBy", "submittedDate")
    url.searchParams.append("sortOrder", "descending")

    // Set proper headers
    const headers = {
      "User-Agent": "CyberArXiv/1.0 (https://github.com/your-username/cyber-arxiv; email@example.com)",
    }

    // Make request with exponential backoff retry logic
    const response = await fetchWithRetry(url.toString(), { headers })

    if (!response.ok) {
      throw new Error(`arXiv API error: ${response.status} ${response.statusText}`)
    }

    const xmlData = await response.text()
    const { papers } = parseArxivResponse(xmlData)

    return papers
  } catch (error) {
    console.error("Error fetching latest papers:", error)
    return []
  }
}

// Helper function to implement exponential backoff for API requests
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  initialDelay = 1000,
): Promise<Response> {
  let retries = 0
  let delay = initialDelay

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options)

      // If rate limited, wait and retry
      if (response.status === 429) {
        retries++
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
        continue
      }

      return response
    } catch (error) {
      retries++

      if (retries >= maxRetries) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }

  throw new Error("Maximum retries exceeded")
}
