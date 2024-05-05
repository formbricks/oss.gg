import { checkIfBountyExists, dispatchBountyOrder, storeBounty } from "@/lib/bounty/service";
import {
  BOUNTY_EMOJI,
  BOUNTY_IDENTIFIER,
  BOUNTY_LABEL_REGEX,
  EVENT_TRIGGERS,
  OSS_GG_LABEL,
  USD_CURRENCY_CODE,
} from "@/lib/constants";
import { extractIssueNumbersFromPrBody, getOctokitInstance } from "@/lib/github/utils";
import { getRepositoryByGithubId } from "@/lib/repository/service";
import { createUser, getUser, getUserByGithubId } from "@/lib/user/service";
import { Webhooks } from "@octokit/webhooks";

/**
 * Handles the event when a bounty is created.
 *
 * @param webhooks - The Webhooks instance.
 */
export const onBountyCreated = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_COMMENTED, async (context) => {
    try {
      const octokit = getOctokitInstance(context.payload.installation?.id!);
      const repo = context.payload.repository.name;
      const issueCommentBody = context.payload.comment.body;
      const bountyCommentRegex = new RegExp(`${BOUNTY_IDENTIFIER}\\s+(\\d+)`);
      const bountyMatch = issueCommentBody.match(bountyCommentRegex);
      const isPR = Boolean(context.payload.issue.pull_request);
      const issueNumber = context.payload.issue.number;
      const owner = context.payload.repository.owner.login;
      const hasOssGgLabel = context.payload.issue.labels.some((label) => label.name === OSS_GG_LABEL);

      const commentOnIssue = async (comment: string) => {
        await octokit.issues.createComment({
          body: comment,
          issue_number: issueNumber,
          repo,
          owner,
        });
      };

      if (bountyMatch) {
        if (isPR) {
          await commentOnIssue("Bounties can be setup in only issues, not in PRs.");
          return;
        }

        if (!hasOssGgLabel) {
          await commentOnIssue(`Bounties can be setup only in issues with the ${OSS_GG_LABEL} label.`);
          return;
        }

        // Check if the repo is registered in oss.gg
        const ossGgRepo = await getRepositoryByGithubId(context.payload.repository.id);
        if (!ossGgRepo) {
          await commentOnIssue(
            "If you are the repo owner, please register at oss.gg to be able to create bounties"
          );
          return;
        } else if (ossGgRepo) {
          let usersThatCanCreateBounty = ossGgRepo?.installation.memberships.map((m) => m.userId);
          if (!usersThatCanCreateBounty) {
            await commentOnIssue("No admins for the given repo in oss.gg!");
            return;
          }
          const ossGgUsers = await Promise.all(
            usersThatCanCreateBounty.map(async (userId) => {
              const user = await getUser(userId);
              return user?.githubId;
            })
          );
          const isUserAllowedToCreateBounty = ossGgUsers?.includes(context.payload.comment.user.id);
          if (!isUserAllowedToCreateBounty) {
            await commentOnIssue("You are not allowed to create bounties! Please contact the repo admin.");
            return;
          }

          const newBountyAmount = parseInt(bountyMatch[1], 10);
          const newBountyLabel = `${BOUNTY_EMOJI} ${newBountyAmount} ${USD_CURRENCY_CODE}`;

          // Regex that matches the bounty label format like "💸 50 USD"
          const previousBountyLabel = context.payload.issue?.labels?.find((label) =>
            label.name.match(BOUNTY_LABEL_REGEX)
          );

          if (previousBountyLabel) {
            const previousBountyAmount = parseInt(previousBountyLabel.name.split(" ")[1], 10);
            if (previousBountyAmount === newBountyAmount) {
              return;
            } else {
              await octokit.issues.updateLabel({
                owner,
                repo,
                name: previousBountyLabel.name,
                new_name: newBountyLabel,
                color: "0E8A16",
              });

              await commentOnIssue(
                `The bounty amount was updated to ${newBountyAmount} ${USD_CURRENCY_CODE}`
              );
            }
          } else {
            await octokit.issues.addLabels({
              owner,
              repo,
              issue_number: issueNumber,
              labels: [newBountyLabel],
            });
            await commentOnIssue(
              `A bounty of ${newBountyAmount} ${USD_CURRENCY_CODE} has been created. Happy hacking!`
            );
          }
        }
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  });
};

/**
 * Handles the event when a bounty pull request is merged.
 * @param webhooks - The Webhooks instance.
 */
export const onBountyPullRequestMerged = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.PULL_REQUEST_CLOSED, async (context) => {
    try {
      const octokit = getOctokitInstance(context.payload.installation?.id!);
      const repo = context.payload.repository.name;
      const owner = context.payload.repository.owner.login;
      const isPrMerged = context.payload.pull_request.merged;
      const prNumber = context.payload.pull_request.number;
      const prBody = context.payload.pull_request.body ?? "";
      const prAuthorGithubId = context.payload.pull_request.user.id;
      const prAuthorUsername = context.payload.pull_request.user.login;

      if (!isPrMerged || !prBody) {
        return;
      }

      const linkedIssueNumbers = extractIssueNumbersFromPrBody(prBody); // This assumes that a PR body can be linked to multiple issues

      const awardBountyToUser = async (issueNumber: number) => {
        const commentOnIssue = async (comment: string) => {
          await octokit.issues.createComment({
            body: comment,
            issue_number: issueNumber,
            repo,
            owner,
          });
        };

        const issue = await octokit.issues.get({
          owner,
          repo,
          issue_number: issueNumber,
        });

        const issueLabels = issue.data.labels.map((label) =>
          typeof label === "string" ? label : label?.name
        );

        // Check if the issue has the required labels and is assigned to the pull request author
        const hasOssGgLabel = issueLabels?.some((label) => label === OSS_GG_LABEL);
        const bountyLabel = issueLabels?.find((label) => label?.match(BOUNTY_LABEL_REGEX));
        const isIssueAssignedToPrAuthor = issue.data.assignees?.some(
          (assignee) => assignee.id === prAuthorGithubId
        );
        const isIssueValid = hasOssGgLabel && bountyLabel && isIssueAssignedToPrAuthor;

        // If the issue is not valid, return
        if (!isIssueValid) {
          return;
        } else {
          const bountyAmount = parseInt(bountyLabel.split(" ")[1], 10);
          const { data: prAuthorProfile } = await octokit.users.getByUsername({
            username: prAuthorUsername,
          });
          const ossGgRepo = await getRepositoryByGithubId(context.payload.repository.id);
          let user = await getUserByGithubId(prAuthorGithubId);
          if (!user) {
            user = await createUser({
              githubId: prAuthorGithubId,
              login: prAuthorUsername,
              email: prAuthorProfile.email,
              name: prAuthorProfile.name,
              avatarUrl: prAuthorProfile.avatar_url,
            });
          }

          const bountyExists = await checkIfBountyExists(issue.data.html_url);
          if (bountyExists) {
            await commentOnIssue("Bounty already exists for this issue. Please check your inbox!");
            console.error(`Bounty already exists for issue: ${issue.data.html_url}`);
            return;
          }

          const bountyOrder = await dispatchBountyOrder({
            fundingSource: "BALANCE",
            amount: bountyAmount,
            currencyCode: USD_CURRENCY_CODE,
            deliveryMethod: "EMAIL",
            recipientName: user?.name!,
            recipientEmail: user?.email!,
          });

          if (bountyOrder) {
            await storeBounty({
              usdAmount: bountyAmount,
              issueUrl: issue.data.html_url,
              status: "open",
              orderId: bountyOrder.order.id,
              rewardId: bountyOrder.order.rewards?.[0].id!,
              userId: user?.id,
              repositoryId: ossGgRepo?.id!,
            });

            await commentOnIssue(
              `Thanks a lot for your valuable contribution! Pls check your inbox for all details to redeem your bounty of ${bountyAmount} ${USD_CURRENCY_CODE}!`
            );
          }
        }
      };

      // Award bounty to each linked issue number
      await Promise.all(linkedIssueNumbers.map(awardBountyToUser));
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  });
};
