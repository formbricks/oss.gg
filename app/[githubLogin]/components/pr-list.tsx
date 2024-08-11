import PullRequest from "@/components/ui/github-pr";
import { TPullRequest } from "@/types/pullRequest";
import React from "react";

interface PullRequestListProps {
  pullRequests: TPullRequest[];
  profileName: string;
}

const PullRequestList: React.FC<PullRequestListProps> = ({ pullRequests, profileName }) => {
  return (
    <div className="col-span-4 space-y-12">
      {pullRequests.length > 0 ? (
        <div>
          <h3 className="mb-2 text-xl font-medium">Contributions by {profileName}</h3>
          {pullRequests.map((pullRequest) => (
            <PullRequest key={pullRequest.href} pullRequest={pullRequest} />
          ))}
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-md bg-zinc-50">
          <p>{profileName} has not yet contributed to an oss.gg repository 🕹️</p>
        </div>
      )}
    </div>
  );
};

export default PullRequestList;
