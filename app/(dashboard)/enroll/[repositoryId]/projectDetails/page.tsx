import { getRepositoryById } from "@/lib/repository/service";

export default async function ProjectDetailsPage({ params }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }
  return (
    <>
      <p>{repository?.projectDescription}</p>
    </>
  );
}
