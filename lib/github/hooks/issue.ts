import {
  ASSIGN_IDENTIFIER,
  AWARD_POINTS_IDENTIFIER,
  CREATE_IDENTIFIER,
  EVENT_TRIGGERS,
  LEVEL_LABEL,
  ON_NEW_ISSUE,
  ON_USER_NOT_REGISTERED,
  OSS_GG_LABEL,
  POINT_IS_NOT_A_NUMBER,
  UNASSIGN_IDENTIFIER,
} from "@/lib/constants";
import { assignUserPoints } from "@/lib/points/service";
import { getRepositoryByGithubId } from "@/lib/repository/service";
import { createUser, getUser, getUserByGithubId } from "@/lib/user/service";
import { Webhooks } from "@octokit/webhooks";

import { isMemberOfRepository } from "../services/user";
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
      const issueCommentBody = context.payload.comment.body;
      const [identifier, points] = issueCommentBody.split(" ");
      const issueNumber = context.payload.issue.number;
      const repo = context.payload.repository.name;
      const owner = context.payload.repository.owner.login;
      const commenter = context.payload.comment.user.login;
      const installationId = context.payload.installation?.id!;
      const octokit = getOctokitInstance(installationId);
      const isOssGgLabel = context.payload.issue.labels.some((label) => label.name === OSS_GG_LABEL);

      if (issueCommentBody === ASSIGN_IDENTIFIER) {
        if (!isOssGgLabel) return;

        const isAssigned = context.payload.issue.assignees.length > 0;
        if (isAssigned) {
          const assignee = context.payload.issue.assignees[0].login;
          const message =
            assignee === commenter
              ? `This issue is already assigned to you. Let's get this shipped!`
              : `This issue is already assigned to another person. Please find more issues [here](https://oss.gg/issues).`;
          await octokit.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: message,
          });
          return;
        }

        const { data: userIssues } = await octokit.issues.listForRepo({
          owner,
          repo,
          assignee: commenter,
          state: "open",
        });

        if (userIssues.length > 0) {
          const assignedIssue = userIssues[0];
          await octokit.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: `You already have an open issue assigned to you [here](${assignedIssue.html_url}). Once that's closed or unassigned, only then we recommend you to take up more.`,
          });
          return;
        }

        await octokit.issues.addAssignees({
          owner,
          repo,
          issue_number: issueNumber,
          assignees: [commenter],
        });
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: `Assigned to @${commenter}! Excited to have you ship this 🕹️`,
        });
      }

      if (identifier === CREATE_IDENTIFIER) {
        //check if the user is a member of the repository in our database
        const isMember = await isMemberOfRepository(commenter, installationId);
        if (!isMember) {
          await octokit.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: `@${commenter}, ${ON_USER_NOT_REGISTERED}`,
          });
          return;
        }
        if (isOssGgLabel) {
          return;
        } else {
          if (isNaN(parseInt(points))) {
            await octokit.issues.createComment({
              owner,
              repo,
              issue_number: issueNumber,
              body: `@${commenter}, ${POINT_IS_NOT_A_NUMBER}`,
            });
            return;
          }
          await octokit.issues.addLabels({
            owner: owner,
            repo: repo,
            issue_number: issueNumber,
            labels: [OSS_GG_LABEL, `:joystick: ${points} points`],
          });
          await octokit.issues.createComment({
            owner: owner,
            repo: repo,
            issue_number: issueNumber,
            body: ON_NEW_ISSUE,
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
};

export const onUnassignCommented = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_COMMENTED, async (context) => {
    try {
      const issueCommentBody = context.payload.comment.body;
      if (issueCommentBody !== UNASSIGN_IDENTIFIER) {
        return;
      }

      const isOssGgLabel = context.payload.issue.labels.some((label) => label.name === OSS_GG_LABEL);
      if (!isOssGgLabel) {
        return;
      }

      const issueNumber = context.payload.issue.number;
      const repo = context.payload.repository.name;
      const owner = context.payload.repository.owner.login;
      const commenter = context.payload.comment.user.login;
      const octokit = getOctokitInstance(context.payload.installation?.id!);

      const isAssigned = context.payload.issue.assignees.length > 0;
      if (!isAssigned) {
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: "This issue is not assigned to anyone.",
        });
        return;
      }

      const assignee = context.payload.issue.assignees[0].login;
      if (assignee === commenter) {
        await octokit.issues.removeAssignees({
          owner,
          repo,
          issue_number: issueNumber,
          assignees: [assignee],
        });
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: "Issue unassigned.",
        });
        return;
      }

      const ossGgRepo = await getRepositoryByGithubId(context.payload.repository.id);
      const usersThatCanUnassign = ossGgRepo?.installation.memberships.map((m) => m.userId) || [];
      const ossGgUsers = await Promise.all(
        usersThatCanUnassign.map(async (userId) => {
          const user = await getUser(userId);
          return user?.githubId;
        })
      );

      const isUserAllowedToUnassign = ossGgUsers?.includes(context.payload.comment.user.id);
      if (!isUserAllowedToUnassign) {
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: "You cannot unassign this issue as it is not assigned to you.",
        });
        return;
      }
      await octokit.issues.removeAssignees({
        owner,
        repo,
        issue_number: issueNumber,
        assignees: [assignee],
      });
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: "Issue unassigned.",
      });
    } catch (err) {
      console.error(err);
    }
  });
};

export const onAwardPoints = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_COMMENTED, async (context) => {
    try {
      const octokit = getOctokitInstance(context.payload.installation?.id!);
      const repo = context.payload.repository.name;
      const issueCommentBody = context.payload.comment.body;
      const awardPointsRegex = new RegExp(`${AWARD_POINTS_IDENTIFIER}\\s+(\\d+)`);
      const match = issueCommentBody.match(awardPointsRegex);
      const isPR = !!context.payload.issue.pull_request;
      const issueNumber = isPR ? context.payload.issue.number : undefined;
      const owner = context.payload.repository.owner.login;

      let comment: string = "";

      if (match) {
        const points = parseInt(match[1], 10);

        if (!issueNumber) {
          console.error("Comment is not on a PR.");
          return;
        }

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
          comment = "You are not allowed to award points! Please contact an admin.";
        } else {
          if (!ossGgRepo) {
            comment = "If you are the repo owner, please register at oss.gg to be able to award points";
          } else {
            const prAuthorGithubId = context.payload.issue.user.id;
            const prAuthorUsername = context.payload.issue.user.login;
            const { data: prAuthorProfile } = await octokit.users.getByUsername({
              username: prAuthorUsername,
            });
            let user = await getUserByGithubId(prAuthorGithubId);
            if (!user) {
              user = await createUser({
                githubId: prAuthorGithubId,
                login: prAuthorUsername,
                email: prAuthorProfile.email,
                name: prAuthorProfile.name,
                avatarUrl: context.payload.issue.user.avatar_url,
              });
              comment = "Please register at oss.gg to be able to claim your rewards.";
            }
            await assignUserPoints(
              user?.id,
              points,
              "Awarded points",
              context.payload.comment.html_url,
              ossGgRepo?.id
            );
            comment = `Awarding ${user.login}: ${points} points!` + " " + comment;
          }
        }

        await octokit.issues.createComment({
          body: comment,
          issue_number: issueNumber,
          repo,
          owner,
        });
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  });
};
