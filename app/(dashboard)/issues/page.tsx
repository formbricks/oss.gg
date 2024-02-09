import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import GitHubIssue from "@/components/ui/githubIssue";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Open issues",
  description: "Comment on these issues to get assigned to work on them.",
};

const dummyIssues = [
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    title: "[FEATURE] Share survey results publicly",
    author: "jobenjada",
    points: "500",
    key: "0",
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: "500",
    key: "1",
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: "500",
    key: "2",
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: "500",
    key: "3",
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: "500",
    key: "4",
  },
];

export default async function SettingsPage() {
  const user = await getCurrentUser();

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
        {dummyIssues ? (
          dummyIssues.map((issue) => <GitHubIssue issue={issue} />)
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
