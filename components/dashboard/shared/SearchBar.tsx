"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({
  placeholder = "Search...",
  className,
}: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialQuery = searchParams.get("search")?.toString() || ""
  const [searchTerm, setSearchTerm] = useState(initialQuery)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchTerm) {
        params.set("search", searchTerm)
      } else {
        params.delete("search")
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, pathname, router, searchParams])

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3 size-4 text-muted-foreground" />

      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={cn("h-9 pl-9", searchTerm ? "pr-9" : "pr-3")}
      />

      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="absolute right-2.5 flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
