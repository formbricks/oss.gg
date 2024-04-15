import EnrollPlayerSwitch from "@/components/enroll-player-switch";
import { DashboardHeader } from "@/components/header";
import NavTabs from "@/components/layout/repo-settings-layout";
import { DashboardShell } from "@/components/shell";
import { userHasPermissionForRepository } from "@/lib/repository/auth";
import { getRepositoryById } from "@/lib/repository/service";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Formbricks",
  description: "Contribute to the worlds fastest growing survey infrastructure.",
};

export default async function RepoSettingsLayout({ children, params }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const hasAccess = await userHasPermissionForRepository(params.repositoryId, user.id);
  if (!hasAccess) {
    redirect("/login");
  }

  const repository = await getRepositoryById(params.repositoryId);
  console.log(repository);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Repo settings"
        text="Set up oss.gg to work well with your repo and community "
      />
      <EnrollPlayerSwitch />
      <NavTabs />
      {children}
    </DashboardShell>
  );
}
