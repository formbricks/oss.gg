import { TLevel } from "@/types/level";
import { GitMerge, GitPullRequestDraft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarImage } from "./avatar";

interface PullRequestProps {
  pr: {
    href: string;
    logoUrl: string;
    title: string;
    author: string;
    repository?: string;
    state: string;
    draft: boolean;
    points?: number | null;
    labels?: string[];
  };
  levelsInRepo?: TLevel[];
}

const GitHubPullRequest = ({ pr, levelsInRepo }: PullRequestProps) => {
  const iconUrlOfLevelsMatchingLabelsSet: Set<string> = new Set();

  levelsInRepo?.forEach((level) => {
    pr.labels?.forEach((label) => {
      if (level.permissions.issueLabels.some((issueLabel) => issueLabel.text === label)) {
        iconUrlOfLevelsMatchingLabelsSet.add(level.iconUrl);
      }
    });
  });

  const iconUrlOfLevelsMatchingLabelsArray: string[] = Array.from(iconUrlOfLevelsMatchingLabelsSet);

  return (
    <Link
      href={pr.href}
      target="_blank"
      key={pr.title}
      className="mb-2 flex items-center space-x-3 rounded-lg bg-secondary p-3 transition-all duration-150 ease-in-out hover:scale-102 hover:cursor-pointer">
      {pr.draft ? (
        <div className="rounded-md border border-gray-200 bg-white p-2">
          <GitPullRequestDraft className="h-8 w-8 text-gray-500" />
        </div>
      ) : pr.state === "open" ? (
        <div className="rounded-md border border-gray-200 bg-white p-2">
          <GitMerge className="h-8 w-8 text-green-500" />
        </div>
      ) : (
        <Image className="rounded-md" src={pr.logoUrl} alt={pr.title} width={50} height={50} />
      )}
      <div className="flex w-full justify-between">
        <div>
          <p className="font-medium">{pr.title}</p>
          <p className="mt-0.5 text-xs">
            opened by {pr.author} {pr.repository && <span>in {pr.repository}</span>}
          </p>
        </div>
        <div className="flex w-1/2 justify-end gap-2 sm:flex-row">
          {iconUrlOfLevelsMatchingLabelsArray.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-card px-3 py-2">
              {iconUrlOfLevelsMatchingLabelsArray.map((iconUrl) => (
                <Avatar key={iconUrl} className="h-7 w-7">
                  <AvatarImage src={iconUrl} alt="level icon" />
                </Avatar>
              ))}
            </div>
          )}
          <div className="flex h-full items-center justify-center whitespace-nowrap rounded-full bg-card px-6 py-1 text-sm font-medium">
            {pr.state === "open" ? "Open 🟢" : "Merged 🟣"}
          </div>
          {pr.points !== null && pr.points !== undefined && (
            <div className="flex h-full items-center justify-center whitespace-nowrap rounded-full bg-card px-6 py-1 text-sm font-medium">
              {pr.points} Points 🔥
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GitHubPullRequest;
