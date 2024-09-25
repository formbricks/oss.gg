import { TPullRequest } from "@/types/pullRequest";
import Link from "next/link";
import React from "react";

interface PullRequestListProps {
  pullRequests: TPullRequest[];
  signedUp: boolean;
}

const PullRequestList: React.FC<PullRequestListProps> = ({ pullRequests, signedUp }) => {
  return (
    <div className="col-span-4 space-y-6">
      {!signedUp && (
        <div className="border border-primary p-4">
          You&apos;re not playing yet.{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>{" "}
          to get started 🕹️
        </div>
      )}
      <div>
        <h2 className="mb-2 font-bold">oss.gg hacktoberfest 2024</h2>
        {pullRequests.some((pr) => pr.points !== null) && signedUp ? (
          <ul className="list-none space-y-2">
            {pullRequests
              .filter((pr) => pr.points !== null)
              .map((pullRequest) => (
                <li key={pullRequest.href}>
                  <Link
                    href={pullRequest.href}
                    className="whitespace-nowrap underline-offset-4 hover:underline">
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
        {pullRequests.some((pr) => pr.points === null) && (
          <div>
            <h2 className="mb-2 font-bold">previous</h2>
            <ul className="list-none space-y-2">
              {pullRequests
                .filter((pr) => pr.points === null)
                .map((pullRequest) => (
                  <li key={pullRequest.href}>
                    <Link
                      href={pullRequest.href}
                      className="whitespace-nowrap  underline-offset-4 hover:underline">
                      {pullRequest.repositoryFullName && <span>{pullRequest.repositoryFullName}</span>}
                      <span> | {pullRequest.title}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PullRequestList;
