import { createNodeMiddleware, Webhooks } from "@octokit/webhooks"

import { env } from "@/env.mjs"

import { onInstallationCreated } from "./hooks/installation"
import { onIssueOpened } from "./hooks/issue"

export const webhooks = new Webhooks({
  secret: env.GITHUB_WEBHOOK_SECRET as string,
})

export const webhookMiddleware = createNodeMiddleware(webhooks, {
  path: "/api/github-webhook",
})

export const registerListeners = () => {
  onIssueOpened(webhooks)
  onInstallationCreated(webhooks)
}
