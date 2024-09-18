import { onBountyCreated, onBountyPullRequestMerged } from "@/lib/github/hooks/bounty";
import {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
  Webhooks,
  createEventHandler,
  createNodeMiddleware,
} from "@octokit/webhooks";

import { GITHUB_APP_WEBHOOK_SECRET } from "../constants";
import { onInstallationCreated } from "./hooks/installation";
import {
  onAssignCommented,
  onAwardPoints,
  onIssueOpened,
  onPullRequestOpened,
  onRejectCommented,
  onUnassignCommented,
} from "./hooks/issue";

// const webhooks = new Webhooks({
//   secret: GITHUB_APP_WEBHOOK_SECRET,
// });

// export const webhookMiddleware = createNodeMiddleware(webhooks, {
//   path: "/api/github-webhook",
// });

// export const registerHooks = async () => {

// onIssueOpened(webhooks);
// onInstallationCreated(webhooks);
// onAssignCommented(webhooks);
// onUnassignCommented(webhooks);
// onAwardPoints(webhooks);
// onPullRequestOpened(webhooks);
// onRejectCommented(webhooks);
// onBountyCreated(webhooks);
// onBountyPullRequestMerged(webhooks);
// };

// const typeGaurds = {
//   issue: (event: EmitterWebhookEvent["payload"]) => "issue" in event,
// };

export const registerHooks = async (event: EmitterWebhookEventName, body: any) => {
  switch (event) {
    case "issues": {
      if (body.action === "opened") {
        onIssueOpened(body);
      }
    }

    case "issue_comment": {
      if (body.action === "created") {
        onAssignCommented(body);
      }
    }

    case "installation": {
      if (body.action === "created") {
        onInstallationCreated(body);
      }
    }
  }
};
