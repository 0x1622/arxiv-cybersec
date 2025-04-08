import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container flex h-[calc(100vh-200px)] flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  )
}
