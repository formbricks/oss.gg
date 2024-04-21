import EnrollPlayerSwitch from "@/components/enroll-player-switch";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import LayoutTabs from "@/components/ui/layoutTabs";
import { userHasPermissionForRepository } from "@/lib/repository/auth";
import { getRepositoryById } from "@/lib/repository/service";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Repo settings",
  description: "Set up oss.gg to work well with your repo and community",
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
  const tabsData = [
    { href: `/repo-settings/${params.repositoryId}/players`, value: "players", label: "Players" },
    {
      href: `/repo-settings/${params.repositoryId}/description`,
      value: "description",
      label: "Project Description",
    },
    { href: `/repo-settings/${params.repositoryId}/levels`, value: "levels", label: "Levels" },
    { href: `/repo-settings/${params.repositoryId}/bounties`, value: "bounties", label: "Bounties" },
  ];
  return (
    <DashboardShell>
      <DashboardHeader
        heading={`${repository?.name} settings`}
        text="Set up oss.gg to work well with your repo and community."
      />
      <EnrollPlayerSwitch />
      <LayoutTabs tabsData={tabsData} tabNumberInUrlPathSegment={3} defaultTab={"players"} />

      {children}
    </DashboardShell>
  );
}
