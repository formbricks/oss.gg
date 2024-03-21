import EnrollPlayerSwitch from "@/components/enroll-player-switch";
import { DashboardHeader } from "@/components/header";
import NavTabs from "@/components/layout/repo-settings-layout";
import { DashboardShell } from "@/components/shell";

export const metadata = {
  title: "Formbricks",
  description: "Contribute to the worlds fastest growing survey infrastructure.",
};

export default function RepoSettingsLayout({ children }) {
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
