import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ProfileWrapper from "@/components/dashboard/shared/profile/ProfileWrapper"

export const metadata = {
  title: "Profile | Admin Dashboard",
  description: "Manage your admin profile settings.",
}

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <Skeleton className="h-10 w-72 rounded-xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  )
}

export default function AdminProfilePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProfileWrapper />
    </Suspense>
  )
}
