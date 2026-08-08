import PageHeader from "@/components/dashboard/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

const DoctorAnalyticsError = () => {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Doctor Analytics"
        description="Monitor doctor growth, availability, specialization, and patient workload."
      />

      <Card className="rounded-2xl">
        <CardContent className="flex min-h-60 items-center justify-center">
          <div className="text-center">
            <p className="font-medium text-destructive">
              Failed to load doctor analytics
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DoctorAnalyticsError
