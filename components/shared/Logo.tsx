import { Activity } from "lucide-react"
import Link from "next/link"

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-bold">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
        <Activity className="size-4 text-primary-foreground" />
      </div>
      <span className="text-lg tracking-tight">
        Doc<span className="text-primary">Zone</span>
      </span>
    </Link>
  )
}

export default Logo
