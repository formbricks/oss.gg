import { env } from "@/env.mjs"

export const LEVEL_LABEL = "level"

export const ASSIGN_IDENTIFIER = "/assign" as const
export const UNASSIGN_IDENTIFIER = "/unassign" as const

export enum EVENT_TRIGGERS {
  ISSUE_OPENED = "issues.opened",
  INSTALLATION_CREATED = "installation.created",
  ISSUE_COMMENTED = "issue_comment.created",
}

export const ON_NEW_ISSUE = "Thanks for opening an issue! It's live on oss.gg!"

export const ON_REPO_NOT_REGISTERED = `This repository is not registered with oss.gg. Please register it at https://oss.gg.`

export const GITHUB_APP_APP_ID = env.GITHUB_APP_APP_ID as string
