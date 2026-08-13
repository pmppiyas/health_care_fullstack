import { IUser } from "@/app/api/user/user.interface"
import PageHeader from "@/components/dashboard/shared/PageHeader"
import { LayoutDashboard } from "lucide-react"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}
const OverviewHeader = ({ user }: { user: any }) => {
  return (
    <PageHeader
      title={` ${getGreeting()}, ${user?.name ?? "User"} `}
      description="Here's what's happening in your clinic today."
      icon={<LayoutDashboard className="size-5" />}
    />
  )
}

export default OverviewHeader
