import { DashboardHeader } from "@/components/header";
import { RepoSelector } from "@/components/repo-selecor";
import { DashboardShell } from "@/components/shell";
import { authOptions } from "@/lib/auth";
import { getRepositoriesForUser } from "@/lib/github/services/repository";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

import { selectRepoActions } from "./actions";

export const metadata = {
  title: "Connect a Repository",
  description: "Select the repository you want to integrate oss.gg with.",
};

export default async function SelectRepoPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const repos = await getRepositoriesForUser(user.id);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Connect a Repository"
        text="Select the repository you want to integrate oss.gg with."
      />
      <div className="space-y-2">
        {repos.map((repo) => (
          <RepoSelector key={repo.id} repo={repo} selectRepoAction={selectRepoActions} />
        ))}
      </div>
    </DashboardShell>
  );
}
