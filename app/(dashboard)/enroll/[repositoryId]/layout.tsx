import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { getRepositoryById } from "@/lib/repository/service";

import LayoutTabs from "../../../../components/ui/layoutTabs";
import EnrollmentStatusBar from "./enrollmentStatusBar";

export const metadata = {
  title: "Formbricks",
  description: "Contribute to the worlds fastest growing survey infrastructure.",
};

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
