import GitHubIssue from "@/components/ui/githubIssue";
import { getAllOssGgIssuesOfRepo } from "@/lib/github/service";
import { getRepositoryById } from "@/lib/repository/service";
import { TLevel } from "@/types/level";

export default async function OpenIssuesPage({ params }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }

  const issues = await getAllOssGgIssuesOfRepo(repository.githubId);
  const levelsInRepo: TLevel[] = repository.levels as TLevel[];

  return (
    <>
      <div className="mt-4">
        {issues.length === 0 ? (
          <p>Currently, there are no open oss.gg issues available.</p>
        ) : (
          issues.map((issue) => <GitHubIssue key={issue.title} issue={issue} levelsInRepo={levelsInRepo} />)
        )}
      </div>
    </>
  );
}
