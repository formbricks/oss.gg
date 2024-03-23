import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import GitHubIssue from "@/components/ui/githubIssue";
import { getAllOssGgIssuesOfRepo } from "@/lib/github/service";

import { getEnrolledRepositoriesAction } from "./actions";

export const metadata = {
  title: "Open issues",
  description: "Comment /assign on one of these issues to assign yourself to work it.",
};

export default async function IssuesPage() {
  const enrolledRepos = await getEnrolledRepositoriesAction();
  const openPRs = await enrolledRepos.reduce(async (accPromise, repo) => {
    const acc = await accPromise;
    const prs = await getAllOssGgIssuesOfRepo(repo.githubId);
    return [...acc, ...prs];
  }, Promise.resolve([]));

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Open issues"
        text="Comment /assign on these issues to assign yourself to these issues."
      />
      <div className="space-y-2">
        {allOpenIssues.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-md bg-muted">
            {enrolledRepos.length === 0 ? (
              <p>You are not yet enrolled in a repo yet. Enroll to play 👇</p>
            ) : (
              <p>Currently, all oss.gg issues in the repos you are enrolled in are assigned to players 👷</p>
            )}
            <Button href="/enroll">Enroll in more repos</Button>
          </div>
        ) : (
          allOpenIssues.map((issue) => <GitHubIssue issue={issue} key={issue.title} />)
        )}
      </div>
    </DashboardShell>
  );
}
