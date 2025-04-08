export interface Paper {
  id: string
  title: string
  authors: string[]
  summary: string
  publishedDate: string
  lastUpdatedDate: string
  categories: string[]
  pdf_url: string
  tags: string[]
}

export interface SearchParams {
  query: string
  year?: string
  category?: string
  tag?: string
  page: number
}

export interface SearchResponse {
  papers: Paper[]
  totalResults: number
  startIndex: number
  itemsPerPage: number
}

// arXiv categories relevant to cybersecurity
export const CYBERSECURITY_CATEGORIES = [
  { id: "cs.CR", name: "Cryptography and Security" },
  { id: "cs.CY", name: "Computers and Society" },
  { id: "cs.NI", name: "Networking and Internet Architecture" },
  { id: "cs.DC", name: "Distributed Computing" },
  { id: "cs.SE", name: "Software Engineering" },
  { id: "cs.AI", name: "Artificial Intelligence" },
  { id: "cs.LG", name: "Machine Learning" },
]

// Cybersecurity specific tags
export const CYBERSECURITY_TAGS = [
  { id: "hardware", name: "Hardware Security" },
  { id: "software", name: "Software Security" },
  { id: "network", name: "Network Security" },
  { id: "ai", name: "AI Security" },
  { id: "ml", name: "ML Security" },
  { id: "cloud", name: "Cloud Security" },
  { id: "iot", name: "IoT Security" },
  { id: "malware", name: "Malware Analysis" },
  { id: "crypto", name: "Cryptography" },
  { id: "privacy", name: "Privacy" },
  { id: "authentication", name: "Authentication" },
  { id: "vulnerability", name: "Vulnerability Analysis" },
]
