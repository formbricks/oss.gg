import { env } from "../env.mjs";


export const DEFAULT_CACHE_REVALIDATION_INTERVAL = 60 * 30; // 30 minutes

export const GITHUB_CACHE_REVALIDATION_INTERVAL = 60 * 60 * 24; // 24 hours

export const GITHUB_APP_CLIENT_ID = env.GITHUB_APP_CLIENT_ID;
export const GITHUB_APP_CLIENT_SECRET = env.GITHUB_APP_CLIENT_SECRET;

// Github
export const LEVEL_LABEL = "level";
export const ASSIGN_IDENTIFIER = "/assign" as const;
export const CREATE_IDENTIFIER = "/oss.gg" as const;
export const UNASSIGN_IDENTIFIER = "/unassign" as const;
export enum EVENT_TRIGGERS {
  ISSUE_OPENED = "issues.opened",
  INSTALLATION_CREATED = "installation.created",
  ISSUE_COMMENTED = "issue_comment.created",
}
export const AWARD_POINTS_IDENTIFIER = "/award" as const;

export const ON_NEW_ISSUE = "Thanks for opening an issue! It's live on oss.gg!";
export const ON_REPO_NOT_REGISTERED = `This repository is not registered with oss.gg. Please register it at [oss.gg](https://oss.gg).`;
export const ON_USER_NOT_REGISTERED = `you are not registered as a member of this repository, so you can't post oss.gg issues. Please register at [oss.gg](https://oss.gg).`;
export const POINT_IS_NOT_A_NUMBER = "please provide a valid number of points to assign."
export const GITHUB_APP_ID = env.GITHUB_APP_ID as string;
export const GITHUB_APP_PRIVATE_KEY = env.GITHUB_APP_PRIVATE_KEY as string;

export const GITHUB_APP_WEBHOOK_SECRET = env.GITHUB_APP_WEBHOOK_SECRET as string;

export const GITHUB_APP_SLUG = env.GITHUB_APP_SLUG as string;
export const GITHUB_APP_ACCESS_TOKEN = env.GITHUB_APP_ACCESS_TOKEN as string;

export const OSS_GG_LABEL = "🕹️ oss.gg" as const;