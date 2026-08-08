import PageHeader from "@/components/dashboard/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

const ErrorPage = ({
  head,
  description,
}: {
  head: string
  description: string
}) => {
  return (
    <div className="w-full space-y-6">
      <PageHeader title={head} description={description} />

      <Card className="rounded-2xl">
        <CardContent className="flex min-h-60 items-center justify-center">
          <div className="text-center">
            <p className="font-medium text-destructive">
              Failed to load {head.toLocaleLowerCase()}
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

export default ErrorPage
