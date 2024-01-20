import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Contribute to oss.gg",
  description: "Help us make this more fun and engaging.",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Contribute to oss.gg"
        text="Help us make this more fun and engaging."
      />
      <div className="grid gap-10"></div>
    </DashboardShell>
  )
}
