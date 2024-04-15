import EnrollPlayerSwitch from "@/components/enroll-player-switch";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userHasPermissionForRepository } from "@/lib/repository/auth";
import { getRepositoryById } from "@/lib/repository/service";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
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

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`${repository?.name} settings`}
        text="Set up oss.gg to work well with your repo and community."
      />
      <EnrollPlayerSwitch />
      <Tabs defaultValue="players" className="w-full">
        <TabsList>
          <Link href={`/repo-settings/${params.repositoryId}/players`}>
            <TabsTrigger value="players">Players</TabsTrigger>
          </Link>
          {/*           <Link href={`/repo-settings/${params.repositoryId}/description`}>
            <TabsTrigger value="description">Project Description</TabsTrigger>
          </Link> */}
          <Link href={`/repo-settings/${params.repositoryId}/levels`}>
            <TabsTrigger value="levels">Levels</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      {children}
    </DashboardShell>
  );
}
