import { env } from "../env.mjs";


export const DEFAULT_CACHE_REVALIDATION_INTERVAL = 60 * 30; // 30 minutes

export const GITHUB_CACHE_REVALIDATION_INTERVAL = 60 * 60 * 24; // 24 hours

export const GITHUB_APP_CLIENT_ID = env.GITHUB_APP_CLIENT_ID;
export const GITHUB_APP_CLIENT_SECRET = env.GITHUB_APP_CLIENT_SECRET;

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
export const GITHUB_APP_ID = env.GITHUB_APP_ID as string;
export const GITHUB_APP_PRIVATE_KEY = env.GITHUB_APP_PRIVATE_KEY as string;

export const GITHUB_APP_WEBHOOK_SECRET = env.GITHUB_APP_WEBHOOK_SECRET as string;

export const GITHUB_APP_SLUG = env.GITHUB_APP_SLUG as string;
export const GITHUB_APP_ACCESS_TOKEN = env.GITHUB_APP_ACCESS_TOKEN as string;

export const OSS_GG_LABEL = "🕹️ oss.gg" as const;

// Storage constants
export const S3_ACCESS_KEY = env.S3_ACCESS_KEY;
export const S3_SECRET_KEY = env.S3_SECRET_KEY;
export const S3_REGION = env.S3_REGION;
export const S3_ENDPOINT_URL = env.S3_ENDPOINT_URL;
export const S3_BUCKET_NAME = env.S3_BUCKET_NAME;
export const MAX_SIZE = 1024 * 1024 * 10 

// URLs
export const WEBAPP_URL =
  env.WEBAPP_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : false) || "http://localhost:3000";