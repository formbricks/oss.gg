import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { getRepositoryById } from "@/lib/repository/service";
import type { Metadata } from "next";

import LayoutTabs from "../../../../components/ui/layoutTabs";
import EnrollmentStatusBar from "./enrollmentStatusBar";

interface MetadataProps {
  params: { repositoryId: string };
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const repository = await getRepositoryById(params.repositoryId);

  return {
    title: repository?.name || "",
    description: repository?.description || "",
  };
}

export default async function RepoDetailPageLayout({ params, children }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }
  const tabsData = [
    { href: `/enroll/${repository.id}/details`, value: "details", label: "Project Details" },
    { href: `/enroll/${repository.id}/leaderboard`, value: "leaderboard", label: "Leaderboard" },
    { href: `/enroll/${repository.id}/issues`, value: "issues", label: "Open Issues" },
  ];
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading={repository?.name} text={repository?.description} />
        <EnrollmentStatusBar repositoryId={repository.id} />
        <LayoutTabs tabsData={tabsData} tabNumberInUrlPathSegment={3} defaultTab={"details"} />
      </DashboardShell>
      <main>{children}</main>
    </>
  );
}
