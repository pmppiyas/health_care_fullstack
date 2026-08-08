import PageHeader from "@/components/dashboard/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

const AnalyticsSkeleton = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="w-full space-y-6">
      <PageHeader title={title} description={description} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-32 animate-pulse rounded-2xl">
            <CardContent className="h-full p-5">
              <div className="h-full rounded-lg bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="h-96 animate-pulse rounded-2xl">
            <CardContent className="h-full p-6">
              <div className="h-full rounded-lg bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AnalyticsSkeleton
