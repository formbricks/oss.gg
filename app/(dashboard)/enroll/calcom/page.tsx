import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Cal.com",
  description: "Scheduling infrastructure for everyone.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <DashboardShell>
      <DashboardHeader heading="Cal.com" text="Scheduling infrastructure for everyone." />
      <Button>Enroll to play at Cal.com</Button>
    </DashboardShell>
  );
}
