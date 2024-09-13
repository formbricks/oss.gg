import { TPullRequest } from "@/types/pullRequest";
import Link from "next/link";
import React from "react";

interface PullRequestListProps {
  pullRequests: TPullRequest[];
}

const PullRequestList: React.FC<PullRequestListProps> = ({ pullRequests }) => {
  return (
    <div className="col-span-4 space-y-6">
      <div>
        <h2 className="mb-2 font-bold">oss.gg contributions</h2>
        {pullRequests.some((pr) => pr.points !== null) ? (
          <ul className="list-none space-y-2">
            {pullRequests
              .filter((pr) => pr.points !== null)
              .map((pullRequest) => (
                <li key={pullRequest.href}>
                  <Link href={pullRequest.href} className="underline-offset-4 hover:underline">
                    {pullRequest.repositoryFullName && <span>{pullRequest.repositoryFullName}</span>}
                    <span> | {pullRequest.points} points 🕹️ | </span>
                    <span>{pullRequest.title}</span>
                  </Link>
                </li>
              ))}
          </ul>
        ) : (
          <p>no oss.gg hackathon contribution yet</p>
        )}
      </div>
      <div>
        <h2 className="mb-2 font-bold">previous</h2>
        <ul className="list-none space-y-2">
          {pullRequests
            .filter((pr) => pr.points === null)
            .map((pullRequest) => (
              <li key={pullRequest.href}>
                <Link href={pullRequest.href} className="underline-offset-4 hover:underline">
                  {pullRequest.repositoryFullName && <span>{pullRequest.repositoryFullName}</span>}
                  <span> | {pullRequest.title}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default PullRequestList;
