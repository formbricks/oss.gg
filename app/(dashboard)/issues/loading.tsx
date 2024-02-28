import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";

export default function DashboardSettingsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Open issues"
        text="Comment /assign on these issues to assign yourself to these issues."
      />
    </DashboardShell>
  );
}
