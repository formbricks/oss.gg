import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Repositories"
        text="Choose open source projects you want to contribute to - and gather points!"
      />
    </DashboardShell>
  );
}
