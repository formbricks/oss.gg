import { env } from "../env.mjs";

export const DEFAULT_CACHE_REVALIDATION_INTERVAL = 60 * 30; // 30 minutes

export const GITHUB_CACHE_REVALIDATION_INTERVAL = 60 * 60 * 24; // 24 hours

export const GITHUB_ACCESS_TOKEN = env.GITHUB_ACCESS_TOKEN;

// Github
export const LEVEL_LABEL = "level";
export const ASSIGN_IDENTIFIER = "/assign" as const;
export const UNASSIGN_IDENTIFIER = "/unassign" as const;
export enum EVENT_TRIGGERS {
  ISSUE_OPENED = "issues.opened",
  INSTALLATION_CREATED = "installation.created",
  ISSUE_COMMENTED = "issue_comment.created",
}
export const AWARD_POINTS_IDENTIFIER = "/award" as const;

export const ON_NEW_ISSUE = "Thanks for opening an issue! It's live on oss.gg!";
export const ON_REPO_NOT_REGISTERED = `This repository is not registered with oss.gg. Please register it at https://oss.gg.`;
export const GITHUB_APP_APP_ID = env.GITHUB_APP_APP_ID as string;
export const GITHUB_APP_PRIVATE_KEY = env.GITHUB_APP_PRIVATE_KEY as string;
export const GITHUB_WEBHOOK_SECRET = env.GITHUB_WEBHOOK_SECRET as string;
