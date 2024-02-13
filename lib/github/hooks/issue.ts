import {
  ASSIGN_IDENTIFIER,
  AWARD_POINTS_IDENTIFIER,
  EVENT_TRIGGERS,
  LEVEL_LABEL,
  UNASSIGN_IDENTIFIER,
} from "@/lib/constants";
import { assignUserPoints } from "@/lib/points/service";
import { getRepositoryByGithubId } from "@/lib/repository/service";
import { getUser, getUserByGithubId } from "@/lib/user/service";
import { Webhooks } from "@octokit/webhooks";

import { getOctokitInstance } from "../utils";

export const onIssueOpened = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_OPENED, async (context) => {
    const projectId = context.payload.repository.id;

    // const isProjectRegistered = await getProject(projectId)
    // if (!isProjectRegistered) {
    //   await context.octokit.issues.createComment(
    //     context.issue({
    //       body: ON_REPO_NOT_REGISTERED,
    //     })
    //   )
    //   return
    // }

    const labels = context.payload.issue.labels?.map((label) => label.name);
    const isLevelLabel = labels?.includes(LEVEL_LABEL);

    if (!isLevelLabel) {
      return;
    }

    // await sendNewIssue(
    //   context.payload.repository.id,
    //   context.payload.issue.user.id,
    //   context.payload.issue.id
    // )

    // await context.octokit.issues.createComment(
    //   context.issue({
    //     body: ON_NEW_ISSUE,
    //   })
    // )
  });
};

export const onAssignCommented = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_COMMENTED, async (context) => {
    try {
      const octokit = getOctokitInstance(context.payload.installation?.id!);

      const issueNumber = context.payload.issue.number;
      const repo = context.payload.repository.name;
      const issueCommentBody = context.payload.comment.body;

      if (issueCommentBody === ASSIGN_IDENTIFIER) {
        await octokit.issues.createComment({
          body: "ok brother",
          issue_number: issueNumber,
          repo,
          owner: "formbricks",
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
};

export const onUnassignCommented = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_COMMENTED, async (context) => {
    try {
      const octokit = getOctokitInstance(context.payload.installation?.id!);

      const issueNumber = context.payload.issue.number;
      const repo = context.payload.repository.name;
      const issueCommentBody = context.payload.comment.body;

      if (issueCommentBody === UNASSIGN_IDENTIFIER) {
        await octokit.issues.createComment({
          body: "no brother",
          issue_number: issueNumber,
          repo,
          owner: "formbricks",
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
};

export const onAwardPoints = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_COMMENTED, async (context) => {
    try {
      const octokit = getOctokitInstance(context.payload.installation?.id!);

      const issueNumber = context.payload.issue.number;
      const repo = context.payload.repository.name;
      const issueCommentBody = context.payload.comment.body;

      const awardPointsRegex = new RegExp(`${AWARD_POINTS_IDENTIFIER}\\s+(\\d+)`);
      const match = issueCommentBody.match(awardPointsRegex);

      let comment: string = "";

      if (match) {
        const points = parseInt(match[1], 10);

        const ossGgRepo = await getRepositoryByGithubId(context.payload.repository.id);

        let usersThatCanAwardPoints = ossGgRepo?.installation.memberships.map((m) => m.userId);
        if (!usersThatCanAwardPoints) {
          throw new Error("No admins for the given repo in oss.gg!");
        }
        const ossGgUsers = await Promise.all(
          usersThatCanAwardPoints.map(async (userId) => {
            const user = await getUser(userId);
            return user?.githubId;
          })
        );
        const isUserAllowedToAwardPoints = ossGgUsers?.includes(context.payload.comment.user.id);
        if (!isUserAllowedToAwardPoints) {
          comment = "You are not allowed to award points";
        } else {
          if (!ossGgRepo) {
            comment = "If you are the repo owner, please register at oss.gg to be able to award points";
          } else {
            const user = await getUserByGithubId(context.payload.comment.user.id);
            if (!user) {
              comment = "Please register at oss.gg to be able to claim your awarded points";
            } else {
              await assignUserPoints(
                user?.id,
                points,
                "Awarded points",
                context.payload.comment.html_url,
                ossGgRepo?.id
              );
              comment = `Awarding ${user.login}: ${points} points!`;
            }
          }
        }

        await octokit.issues.createComment({
          body: comment,
          issue_number: issueNumber,
          repo,
          owner: "formbricks",
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
};
