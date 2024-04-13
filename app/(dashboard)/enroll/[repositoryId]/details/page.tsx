import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getRepositoryById } from "@/lib/repository/service";

export default async function ProjectDetailsPage({ params }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }
  return (
    <div className="mt-4">
      {repository?.projectDescription ? (
        <MarkdownRenderer content={repository?.projectDescription} />
      ) : (
        <p>No details added yet.</p>
      )}
    </div>
  );
}
