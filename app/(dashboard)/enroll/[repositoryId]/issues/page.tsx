import GitHubIssue from "@/components/ui/githubIssue";
import { getAllOssGgIssuesOfRepo } from "@/lib/github/service";
import { getRepositoryById } from "@/lib/repository/service";

export default async function OpenIssuesPage({ params }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }

  const issues = await getAllOssGgIssuesOfRepo(repository.githubId);

  return (
    <>
      <div className="space-y-2">
        {issues.length === 0 ? (
          <p>Currently, there are no open oss.gg issues available.</p>
        ) : (
          issues.map((issue) => <GitHubIssue issue={issue} key={issue.title} />)
        )}
      </div>
    </>
  );
}
