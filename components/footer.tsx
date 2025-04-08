import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex items-center justify-center py-4">
        <p className="text-sm text-muted-foreground flex items-center gap-1 font-heading">
          Made with love <Heart className="h-3 w-3 fill-red-500 text-red-500" /> by 0x1622
        </p>
      </div>
    </footer>
  )
}
