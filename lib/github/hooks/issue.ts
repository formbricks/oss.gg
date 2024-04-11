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
  REJECTION_MESSAGE_TEMPLATE,
  REJECT_IDENTIFIER,
  UNASSIGN_IDENTIFIER,
} from "@/lib/constants";
import { assignUserPoints } from "@/lib/points/service";
import { getRepositoryByGithubId } from "@/lib/repository/service";
import { createUser, getUser, getUserByGithubId } from "@/lib/user/service";
import { triggerDotDevClient } from "@/trigger";
import { Webhooks } from "@octokit/webhooks";

import { isMemberOfRepository } from "../services/user";
import { extractIssueNumbers, getOctokitInstance } from "../utils";

export const onIssueOpened = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_OPENED, async (context) => {
    const projectId = context.payload.repository.id;

    //TODO:
    //1. check if the issue has the oss label
    //2. if it has the OSS label find all the users that are currently subscribed to the repo, have the right points/permission, then send them an email

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

      if (issueCommentBody.trim() === ASSIGN_IDENTIFIER) {
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

        const allCommentsInTheIssue = await octokit.issues.listComments({
          owner,
          repo,
          issue_number: issueNumber,
          per_page: 100,
        });
        let { extractedUserNames } =
          await extractUserNamesFromCommentsForRejectCommand(allCommentsInTheIssue);

        const isUserPrRejectedBefore = extractedUserNames?.includes(context.payload.comment.user.login);
        if (isUserPrRejectedBefore) {
          await octokit.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: "You have already attempted this issue.We will open the issue up for a different contributor to work on. Feel free to stick around in the community and pick up a different issue.",
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

        //send trigger event to wait for 36hrs then send a reminder if the user has not created a pull request
        await triggerDotDevClient.sendEvent({
          name: "issue.reminder",
          payload: {
            issueNumber,
            repo,
            owner,
            commenter,
            installationId: context.payload.installation?.id,
          },
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
      if (issueCommentBody.trim() !== UNASSIGN_IDENTIFIER) {
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

      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: "Issue unassigned.",
      });

      await octokit.issues.removeAssignees({
        owner,
        repo,
        issue_number: issueNumber,
        assignees: [assignee],
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

export const onPullRequestOpened = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.PULL_REQUEST_OPENED, async (context) => {
    const pullRequestUser = context.payload.pull_request.user;
    const body = context.payload.pull_request.body;
    const issueNumber = extractIssueNumbers(body!);
    // create a comment on the issue that a PR has been opened

    return;
  });
};

export const onRejectCommented = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_COMMENTED, async (context) => {
    try {
      const issueCommentBody = context.payload.comment.body;
      const issueNumber = context.payload.issue.number;
      const repo = context.payload.repository.name;
      const owner = context.payload.repository.owner.login;
      const octokit = getOctokitInstance(context.payload.installation?.id!);
      const rejectRegex = new RegExp(`${REJECT_IDENTIFIER}\\s*pr #(\\d+)\\s*(.*)`, "i");
      const match = issueCommentBody.match(rejectRegex);
      const isCommentOnPullRequest = context.payload.issue.pull_request;
      const isAssigned = context.payload.issue.assignees.length > 0;
      let comment: string = "";

      if (!match) {
        return;
      }

      const isOssGgLabel = context.payload.issue.labels.some((label) => label.name === OSS_GG_LABEL);
      if (!isOssGgLabel) {
        return;
      }

      if (!isAssigned) {
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: `No user is assigned.Assign the user who created the pr.`,
        });
        return;
      }

      if (isCommentOnPullRequest) {
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: `${REJECT_IDENTIFIER} works on an issue.`,
        });
        return;
      }

      const prNumber = Number(match[1]);
      const message = match[2];
      const ossGgRepo = await getRepositoryByGithubId(context.payload.repository.id);

      let usersThatCanRejectPr = ossGgRepo?.installation.memberships.map((m) => m.userId);
      if (!usersThatCanRejectPr) {
        throw new Error("No admins for the given repo in oss.gg!");
      }
      const ossGgUsers = await Promise.all(
        usersThatCanRejectPr.map(async (userId) => {
          const user = await getUser(userId);
          return user?.githubId;
        })
      );
      const isUserAllowedToRejectPr = ossGgUsers?.includes(context.payload.comment.user.id);
      if (!isUserAllowedToRejectPr) {
        comment = "You are not allowed to reject a pull request.";
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: comment,
        });
        return;
      } else {
        const assignee = context.payload.issue.assignees[0].login;
        const rejectionMessage = REJECTION_MESSAGE_TEMPLATE(assignee, message);

        //assumption: taking onlt first 100 comments because first rejection will happen in first 100 comments.If comments are more than 100 then such heavy discussed issue mostly would be given to a core team member.Even if it is given to a non core team member, our requirements would fulfill within 100 comments.
        const allCommentsInTheIssue = await octokit.issues.listComments({
          owner,
          repo,
          issue_number: issueNumber,
          per_page: 100,
        });

        let hasFirstRejectionOccurred = false;

        const { hasFirstOccurred } = checkFirstOccurence(
          allCommentsInTheIssue.data,
          "Hey\\s+(?:\\w+\\s+)?(.*),\\s+Thanks a lot for the time and effort you put into shipping this! Unfortunately,\\s+we cannot accept your contribution for the following reason:(.*)",
          "g"
        );
        hasFirstRejectionOccurred = hasFirstOccurred;

        if (!hasFirstRejectionOccurred) {
          //this has to be above rejection message,will make it easier to prevent same user from assigning in the onAssignCommented function.
          await octokit.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: `Attempted:${assignee}`,
          });
        } else {
          const { extractedUserNames, commentId } =
            await extractUserNamesFromCommentsForRejectCommand(allCommentsInTheIssue);

          extractedUserNames.push(assignee);

          commentId &&
            (await octokit.issues.updateComment({
              owner,
              repo,
              issue_number: issueNumber,
              comment_id: commentId,
              body: `Attempted:${extractedUserNames}`,
            }));
        }

        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: rejectionMessage,
        });

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
          body: "Issue up for grabs.",
        });
        await octokit.pulls.update({
          owner,
          repo,
          pull_number: prNumber,
          state: "closed",
        });
      }
    } catch (err) {
      console.error(err);
    }
  });
};
const extractUserNamesFromCommentsForRejectCommand = async (allCommentsInTheIssue) => {
  let hasFirstRejectCommandComment: boolean = false;
  let indexFirstRejectCommandComment: number | null = null;

  const { hasFirstOccurred, indexOfFirstOccurred } = checkFirstOccurence(
    allCommentsInTheIssue.data,
    `${REJECT_IDENTIFIER}\\s*pr #(\\d+)\\s*(.*)`,
    "i"
  );
  hasFirstRejectCommandComment = hasFirstOccurred;
  indexFirstRejectCommandComment = indexOfFirstOccurred;

  if (
    indexFirstRejectCommandComment !== null &&
    hasFirstRejectCommandComment &&
    indexFirstRejectCommandComment + 1 > 0
  ) {
    const commentContainingUserNamesWhosePrIsRejected =
      allCommentsInTheIssue.data[indexFirstRejectCommandComment + 1];

    let extractedUserNames: string[] = [];
    const namesRegex = /Attempted:(.*)/;
    const match = commentContainingUserNamesWhosePrIsRejected?.body?.match(namesRegex);

    if (match && match[1]) {
      const namesString = match[1];
      extractedUserNames = namesString.split(" ");
    }
    const commentId = Number(commentContainingUserNamesWhosePrIsRejected?.id);

    return { extractedUserNames, commentId };
  } else {
    return { extractedUserNames: [] as string[], commentId: null };
  }
};

const checkFirstOccurence = (comments, regex: string, otherRegexOption: string) => {
  let hasFirstOccurred: boolean = false;
  let indexOfFirstOccurred: number | null = null;

  comments.forEach((comment, index) => {
    if (hasFirstOccurred) return; // stop the loop after first occurrence is found.

    const commentBody = comment.body || "";
    const isMatch = commentBody.match(regex, otherRegexOption);
    if (isMatch) {
      hasFirstOccurred = true;
      indexOfFirstOccurred = index;
    }
  });

  return { hasFirstOccurred, indexOfFirstOccurred };
};
