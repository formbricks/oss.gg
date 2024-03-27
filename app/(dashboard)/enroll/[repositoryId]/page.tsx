import { redirect } from "next/navigation";

export default async function RepositoryDetailPage({ params }) {
  return redirect(`/enroll/${params.repositoryId}/projectDetails`);
}
