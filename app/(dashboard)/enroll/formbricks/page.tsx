import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Formbricks",
  description:
    "Contribute to the worlds fastest growing survey infrastructure.",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Formbricks"
        text="Contribute to the worlds fastest growing survey infrastructure."
      />
      <Button>Enroll to play at Formbricks</Button>
    </DashboardShell>
  )
}
