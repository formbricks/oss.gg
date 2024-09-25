"use server";

import { OSS_GG_REPO_ID } from "@/lib/constants";
import { getAllOssGgIssuesOfRepo } from "@/lib/github/service";
import { TPullRequest } from "@/types/pullRequest";
import Link from "next/link";

export default async function IssuesPage() {
  const pullRequests: TPullRequest[] = await getAllOssGgIssuesOfRepo(Number(OSS_GG_REPO_ID));

  return (
    <div className="space-y-2 font-mono text-xs">
      <h1 className="pb-2 font-bold">issues ({pullRequests.length})</h1>
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
