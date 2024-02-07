import { env } from "@/env.mjs";
import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";

import { onInstallationCreated } from "./hooks/installation";
import { onAssignCommented, onIssueOpened, onUnassignCommented } from "./hooks/issue";

const webhooks = new Webhooks({
  secret: env.GITHUB_WEBHOOK_SECRET as string,
});

export const webhookMiddleware = createNodeMiddleware(webhooks, {
  path: "/api/github-webhook",
});

export const registerHooks = async () => {
  onIssueOpened(webhooks);
  onInstallationCreated(webhooks);
  onAssignCommented(webhooks);
  onUnassignCommented(webhooks);
};
