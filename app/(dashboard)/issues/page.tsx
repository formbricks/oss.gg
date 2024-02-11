import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import GitHubIssue from "@/components/ui/githubIssue";
import { authOptions } from "@/lib/auth";
import { getAllOpenIssuesOfRepo } from "@/lib/github/service";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Open issues",
  description: "Comment on these issues to get assigned to work on them.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const openPRs = await getAllOpenIssuesOfRepo("formbricks/formbricks");

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Open issues"
        text="Comment on these issues to get assigned to work on them."
      />
      <div className="space-y-2">
        {openPRs ? (
          openPRs.map((issue) => <GitHubIssue issue={issue} key={issue.title} />)
        ) : (
          <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-md bg-slate-50">
            <p>You have not yet enrolled to play in a repository 🕹️</p>
            <Button href="/enroll">Explore oss.gg repositories</Button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
