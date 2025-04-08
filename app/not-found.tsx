import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex h-[calc(100vh-200px)] flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">404 - Not Found</h1>
      <p className="mb-8 text-muted-foreground">The paper you're looking for doesn't exist or has been moved.</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
