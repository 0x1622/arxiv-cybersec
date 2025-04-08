"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SearchContextType = {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  debugMode: boolean
  toggleDebugMode: () => void
  apiRateLimited: boolean
  setApiRateLimited: (rateLimited: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [apiRateLimited, setApiRateLimited] = useState(false)

  // Reset rate limited status after a delay
  useEffect(() => {
    if (apiRateLimited) {
      const timer = setTimeout(() => {
        setApiRateLimited(false)
      }, 60000) // Reset after 1 minute

      return () => clearTimeout(timer)
    }
  }, [apiRateLimited])

  const toggleDebugMode = () => {
    setDebugMode((prev) => !prev)
  }

  return (
    <SearchContext.Provider
      value={{
        isLoading,
        setIsLoading,
        debugMode,
        toggleDebugMode,
        apiRateLimited,
        setApiRateLimited,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
