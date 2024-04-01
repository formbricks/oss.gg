"use client";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import EnrollmentStatusBar from "./enrollmentStatusBar";

export default function LayoutTabs({ repository }) {
  const path = usePathname();
  const activeTab = path?.split("/")[3] || "details";

  return (
    <DashboardShell>
      <DashboardHeader heading={repository?.name} text={repository?.description} />
      <EnrollmentStatusBar repositoryId={repository.id} />
      <Tabs defaultValue={`${activeTab}`} className="w-full">
        <TabsList>
          <Link href={`/enroll/${repository.id}/details`}>
            <TabsTrigger value="details">Project Details</TabsTrigger>
          </Link>
          <Link href={`/enroll/${repository.id}/leaderboard`}>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </Link>
          <Link href={`/enroll/${repository.id}/issues`}>
            <TabsTrigger value="issues">Open Issues</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </DashboardShell>
  );
}
