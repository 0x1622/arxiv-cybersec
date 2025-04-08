import { redirect } from 'next/navigation'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Redirect all search requests to the home page with the same parameters
  redirect(`/?${new URLSearchParams(searchParams as Record<string, string>).toString()}`)
}
