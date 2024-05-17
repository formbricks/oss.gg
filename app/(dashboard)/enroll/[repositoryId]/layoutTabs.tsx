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
          {[
            { href: `/enroll/${repository.id}/details`, value: "details", label: "Project Details" },
            { href: `/enroll/${repository.id}/leaderboard`, value: "leaderboard", label: "Leaderboard" },
            { href: `/enroll/${repository.id}/issues`, value: "issues", label: "Open Issues" }
          ].map((tab, index) => (
            <Link key={index} href={tab.href} className="max-[640px]:w-full">
              <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
    </DashboardShell>
  );
}
