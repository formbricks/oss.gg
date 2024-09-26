import { onBountyCreated, onBountyPullRequestMerged } from "@/lib/github/hooks/bounty";
import { EmitterWebhookEvent, EmitterWebhookEventName } from "@octokit/webhooks";

import {
  ASSIGN_IDENTIFIER,
  AWARD_POINTS_IDENTIFIER,
  BOUNTY_IDENTIFIER,
  REJECT_IDENTIFIER,
  UNASSIGN_IDENTIFIER,
} from "../constants";
import { onInstallationCreated } from "./hooks/installation";
import {
  onAssignCommented,
  onAwardPoints,
  onIssueOpened,
  onPullRequestMerged,
  onRejectCommented,
  onUnassignCommented,
} from "./hooks/issue";

export const registerHooks = async (
  event: EmitterWebhookEventName,
  body: EmitterWebhookEvent<"issue_comment.created" | "pull_request" | "installation" | "issues">["payload"]
) => {
  switch (event) {
    case "issues": {
      if (body.action === "opened") {
        onIssueOpened(body as EmitterWebhookEvent<"issues.opened">["payload"]);
      }
      break;
    }

    case "issue_comment": {
      if (body.action === "created") {
        const payload = body as EmitterWebhookEvent<"issue_comment.created">["payload"];
        const commentBody = payload.comment.body;
        const handlers = {
          [ASSIGN_IDENTIFIER]: onAssignCommented,
          [UNASSIGN_IDENTIFIER]: onUnassignCommented,
          [AWARD_POINTS_IDENTIFIER]: onAwardPoints,
          [REJECT_IDENTIFIER]: onRejectCommented,
          [BOUNTY_IDENTIFIER]: onBountyCreated,
        };

        for (const [identifier, handler] of Object.entries(handlers)) {
          if (commentBody.startsWith(identifier)) {
            handler(payload);
            break;
          }
        }
      }
      break;
    }

    case "installation": {
      if (body.action === "created") {
        onInstallationCreated(body as EmitterWebhookEvent<"installation">["payload"]);
      }
      break;
    }
    case "pull_request":
      {
        if (body.action === "closed") {
          onPullRequestMerged(body as EmitterWebhookEvent<"pull_request">["payload"]);
        }

        if (body.action === "closed") {
          onBountyPullRequestMerged(body as EmitterWebhookEvent<"pull_request.closed">["payload"]);
        }
      }
      break;
  }
};
