import { RepoSelector } from "@/app/(dashboard)/manage-repos/repoSelector";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { authOptions } from "@/lib/auth";
import { getRepositoriesForUser } from "@/lib/github/services/repository";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Repositories",
  description: "Manage repositories you want to integrate oss.gg with.",
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
        heading="Manage Repositories"
        text="Manage repositories you want to integrate oss.gg with."
      />
      <div className="space-y-2">
        {repos.length > 0 ? (
          <>
            {repos.map((repo) => (
              <RepoSelector key={repo.id} repo={repo} />
            ))}
          </>
        ) : (
          <p>No repos loaded from GitHub 🤷</p>
        )}
      </div>
    </DashboardShell>
  );
}
