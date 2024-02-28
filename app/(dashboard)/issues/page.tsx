import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import GitHubIssue from "@/components/ui/githubIssue";
import { getAllOpenIssuesOfRepo } from "@/lib/github/service";

import { getEnrolledRepositoriesAction } from "./actions";

export const metadata = {
  title: "Open issues",
  description: "Comment on these issues to get assigned to work on them.",
};

export default async function IssuesPage() {
  const openPRs = await getAllOpenIssuesOfRepo("formbricks/formbricks");
  const enrolledRepos = await getEnrolledRepositoriesAction();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Open issues"
        text="Comment on these issues to get assigned to work on them."
      />
      <div className="space-y-2">
        {enrolledRepos && openPRs.length > 1 ? (
          openPRs.map((issue) => <GitHubIssue issue={issue} key={issue.title} />)
        ) : enrolledRepos && openPRs.length < 1 ? (
          <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-md bg-muted">
            <p>Currently, all oss.gg issues are assigned to players 👷</p>
            <Button href="https://github.com/formbricks/formbricks/labels/%F0%9F%95%B9%EF%B8%8F%20oss.gg">
              Have a look
            </Button>
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-md bg-muted">
            <p>You have not yet enrolled to play in a repository 🕹️</p>
            <Button href="/enroll">Explore oss.gg repositories</Button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
