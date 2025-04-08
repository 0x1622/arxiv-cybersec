import { redirect } from 'next/navigation'

// Configure for static export
export const dynamic = 'force-static'
export const revalidate = false

// Add a minimal set of search params for static generation
export function generateStaticParams() {
  return [
    // Empty search parameters to generate the base route
    {},
  ]
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // For static export, we need to handle the search parameters without using them directly
  // Instead, we'll redirect to the home page with the same parameters on the client side
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  const redirectUrl = searchParamsString ? `/?${searchParamsString}` : '/';
  
  // This is executed on the client side during runtime after hydration
  if (typeof window !== 'undefined') {
    window.location.href = redirectUrl;
    return null;
  }
  
  // Fallback for SSR/static generation
  return (
    <div className="container mx-auto px-4 py-8">
      <p>Redirecting to search results...</p>
    </div>
  );
}
