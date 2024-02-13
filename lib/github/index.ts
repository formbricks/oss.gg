import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";

import { GITHUB_WEBHOOK_SECRET } from "../constants";
import { onInstallationCreated } from "./hooks/installation";
import { onAssignCommented, onAwardPoints, onIssueOpened, onUnassignCommented } from "./hooks/issue";

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
  onAwardPoints(webhooks);
};
