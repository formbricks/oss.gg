import GitHubIssue from "@/components/ui/githubIssue";
import { getAllOssGgIssuesOfRepo } from "@/lib/github/service";
import { getRepositoryById } from "@/lib/repository/service";

export default async function OpenIssuesPage({ params }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }

  const openIssues = await getAllOssGgIssuesOfRepo(repository.githubId);

  return (
    <>
      <div className="space-y-2">
        {openIssues.length === 0 ? (
          <p>Currently, there are no open oss.gg issues available.</p>
        ) : (
          openIssues.map((issue) => <GitHubIssue issue={issue} key={issue.title} />)
        )}
      </div>
    </>
  );
}
