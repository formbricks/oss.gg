import { GitMerge, GitPullRequestDraft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Issue {
  href: string;
  logoUrl: string;
  title: string;
  author: string;
  repository: string;
  assignee?: string | null;
  state?: string;
  draft?: boolean;
  isIssue: boolean;
  points?: null | number;
}

const GitHubIssue: React.FC<{ issue: Issue }> = ({ issue }) => {
  return (
    <Link
      href={issue.href}
      target="_blank"
      key={issue.title}
      className={`mb-2 flex items-center space-x-3 rounded-lg bg-secondary p-3 hover:cursor-pointer ${!issue.assignee ? `transition-all duration-150 ease-in-out hover:scale-102` : `bg-secondary/50 opacity-80`}`}>
      {!issue.isIssue && issue.draft ? (
        <div className="rounded-md border border-gray-200 bg-white p-2">
          <GitPullRequestDraft className="h-8 w-8 text-gray-500" />
        </div>
      ) : !issue.isIssue && issue.state === "open" ? (
        <div className="rounded-md border border-gray-200 bg-white p-2">
          <GitMerge className="h-8 w-8 text-green-500" />
        </div>
      ) : (
        <Image className="rounded-md" src={issue.logoUrl} alt={issue.title} width={50} height={50} />
      )}
      <div className="flex w-full justify-between">
        <div>
          <p className="font-medium">{issue.title}</p>
          <p className="mt-0.5 text-xs">
            opened by {issue.author} in {issue.repository}
          </p>
        </div>
        <div className="flex gap-2">
          {issue.assignee && issue.isIssue ? (
            <div className="flex items-center justify-center whitespace-nowrap rounded-full bg-card px-6 py-1 text-sm font-medium">
              {issue.assignee} 🚧
            </div>
          ) : (
            issue.isIssue && (
              <div className="flex items-center justify-center whitespace-nowrap rounded-full bg-card px-6 py-1 text-sm font-medium">
                Assign yourself 🫵
              </div>
            )
          )}
          {issue.points && issue.points !== null && (
            <div className="flex items-center justify-center whitespace-nowrap rounded-full bg-card px-6 py-1 text-sm font-medium">
              {issue.points} Points 🔥
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GitHubIssue;
