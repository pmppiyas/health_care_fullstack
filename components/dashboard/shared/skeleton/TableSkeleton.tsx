import { Skeleton } from "@/components/ui/skeleton"

const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3.5 w-44" />
          </div>
        </div>
      </div>
      <Skeleton className="h-9 w-72 rounded-lg" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

export default TableSkeleton
