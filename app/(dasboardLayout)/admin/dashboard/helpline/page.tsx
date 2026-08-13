import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import HelplineWrapper from "@/components/dashboard/shared/helpline/HelplineWrapper"

export const metadata = {
  title: "Helpline | Admin Dashboard",
  description: "Get developer technical support.",
}

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <Skeleton className="h-10 w-72 rounded-xl" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  )
}

export default function AdminHelplinePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HelplineWrapper />
    </Suspense>
  )
}
