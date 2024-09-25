"use server";

import { getAllOssGgIssuesOfRepos } from "@/lib/github/service";
import { getAllRepositories } from "@/lib/repository/service";
import { TPullRequest } from "@/types/pullRequest";
import Link from "next/link";

export default async function IssuesPage() {
  const ossGgRepositories = await getAllRepositories();
  const pullRequests: TPullRequest[] = await getAllOssGgIssuesOfRepos(
    ossGgRepositories.map((repo) => repo.githubId)
  );

  return (
    <div className="space-y-2 font-mono text-xs">
      <h1 className="pb-2 font-bold">open issues ({pullRequests.length})</h1>
      <ul className="list-none space-y-2">
        {pullRequests.map((pullRequest) => (
          <li key={pullRequest.href}>
            <Link href={pullRequest.href} className="underline-offset-4 hover:underline">
              {pullRequest.repositoryFullName && <span>{pullRequest.repositoryFullName}</span>}
              {pullRequest.points !== undefined && <span> | {pullRequest.points} points 🕹️ | </span>}
              <span>{pullRequest.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
