import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";

export default function SelectRepoLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manage Repositories"
        text="Manage repositories you want to integrate oss.gg with."
      />
    </DashboardShell>
  );
}
