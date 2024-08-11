import { TPullRequest } from "@/types/pullRequest";
import { GitMerge, GitPullRequestArrow, GitPullRequestClosedIcon, GitPullRequestDraft } from "lucide-react";
import Link from "next/link";

interface PullRequestProps {
  pullRequest: TPullRequest;
}

const PullRequest = ({ pullRequest }: PullRequestProps) => {
  return (
    <Link
      href={pullRequest.href}
      target="_blank"
      key={pullRequest.title}
      className="mb-2 flex items-center space-x-3 rounded-lg bg-secondary p-3 transition-all duration-150 ease-in-out hover:scale-102 hover:cursor-pointer">
      {pullRequest.status === "draft" ? (
        <div className="rounded-md border border-gray-200 bg-white p-2">
          <GitPullRequestDraft className="h-8 w-8 text-gray-500" />
        </div>
      ) : pullRequest.status === "open" ? (
        <div className="rounded-md border border-gray-200 bg-white p-2">
          <GitPullRequestArrow className="h-8 w-8 text-green-500" />
        </div>
      ) : pullRequest.status === "merged" ? (
        <div className="rounded-md border border-gray-200 bg-white p-2">
          <GitMerge className="h-8 w-8 text-green-800" />
        </div>
      ) : pullRequest.status === "closed" ? (
        <div className="rounded-md border border-gray-200 bg-white p-2">
          <GitPullRequestClosedIcon className="h-8 w-8 text-red-800" />
        </div>
      ) : null}
      <div className="flex w-full justify-between">
        <div>
          <p className="font-medium">{pullRequest.title}</p>
          <p className="mt-0.5 text-xs">
            opened by {pullRequest.author}{" "}
            {pullRequest.repositoryFullName && <span>in {pullRequest.repositoryFullName}</span>}
          </p>
        </div>
        <div className="flex w-1/2 justify-end gap-2 sm:flex-row">
          {pullRequest.points !== null && pullRequest.points !== undefined && pullRequest.points !== 0 && (
            <div className="flex h-full items-center justify-center whitespace-nowrap rounded-full bg-card px-6 py-1 text-sm font-medium">
              {pullRequest.points} Points 🔥
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PullRequest;
