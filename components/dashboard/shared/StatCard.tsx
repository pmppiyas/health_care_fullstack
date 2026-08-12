import { Card, CardContent } from "@/components/ui/card"

type StatCardProps = {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card className="w-full rounded-2xl">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard
