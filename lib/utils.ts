import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getCategoryColor(categoryId: string): string {
  // Map category IDs to tailwind colors
  const colorMap: Record<string, string> = {
    "cs.CR": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    "cs.NI": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "cs.AI": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "cs.CY": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "cs.DC": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "cs.SE": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  }

  return colorMap[categoryId] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
}
