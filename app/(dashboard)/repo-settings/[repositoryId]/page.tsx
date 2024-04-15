import { redirect } from "next/navigation";

export default function RepoSettingsDashboard({ params }) {
  return redirect(`/repo-settings/${params.repositoryId}/players`);
}
