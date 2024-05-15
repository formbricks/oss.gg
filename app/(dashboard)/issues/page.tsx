import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import GitHubIssue from "@/components/ui/githubIssue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllOssGgIssuesOfRepo } from "@/lib/github/service";
import { capitalizeFirstLetter } from "@/lib/utils/textformat";

import { getEnrolledRepositoriesAction } from "./actions";

export const metadata = {
  title: "Open issues",
  description: "Comment /assign on one of these issues to assign yourself to work it.",
};

export default async function IssuesPage() {
  const enrolledRepos = await getEnrolledRepositoriesAction();

  const issuesPromises = enrolledRepos.map((repo) => getAllOssGgIssuesOfRepo(repo.githubId));
  const issuesResults = await Promise.all(issuesPromises);
  const allOpenIssues = issuesResults.flat();

  const repoWithIssuesMap = enrolledRepos.reduce(
    (acc, repo, index) => {
      acc[capitalizeFirstLetter(repo.name)] = {
        issues: issuesResults[index],
        level: repo.levels,
      };
      return acc;
    },
    {
      "All Projects": {
        issues: allOpenIssues,
        level: [],
      },
    }
  );

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
          <Tabs defaultValue={Object.keys(repoWithIssuesMap)[0]}>
            <TabsList>
              {Object.keys(repoWithIssuesMap).map((repoName) => (
                <TabsTrigger key={repoName} value={repoName}>
                  {repoName}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(repoWithIssuesMap).map(([repoName, { issues, level }]) => (
              <TabsContent key={repoName} value={repoName}>
                {issues.map((issue) => (
                  <GitHubIssue key={issue.title} issue={issue} levelsInRepo={level} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </DashboardShell>
  );
}
