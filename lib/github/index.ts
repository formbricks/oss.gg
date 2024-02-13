import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";

import { onInstallationCreated } from "./hooks/installation";
import { onAssignCommented, onIssueOpened, onUnassignCommented } from "./hooks/issue";
import { GITHUB_WEBHOOK_SECRET } from "../constants";

const webhooks = new Webhooks({
  secret: GITHUB_WEBHOOK_SECRET,
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
