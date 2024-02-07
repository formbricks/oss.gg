import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";

export default function SelectRepoLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Connect a Repository"
        text="Select the repository you want to integrate oss.gg with."
      />
    </DashboardShell>
  );
}
