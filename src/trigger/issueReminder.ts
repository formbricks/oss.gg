import { extractIssueNumbers, getOctokitInstance } from "@/lib/github/utils";
import { Octokit } from "@octokit/rest";
import { logger, task, wait } from "@trigger.dev/sdk/v3";

const findPullRequestByIssueAndCommenter = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number,
  commenter: string
) => {
  const { data: pullRequests } = await octokit.pulls.list({
    owner,
    repo,
    state: "open",
  });
  const pullRequest = pullRequests.find((pr) => {
    const openedBy = pr.user?.login;
    const prBody = pr.body;
    const prIssueNumber = extractIssueNumbers(prBody!);
    // Return the PR that matches the issue number and belongs to the commenter
    return prIssueNumber.includes(issueNumber) && openedBy === commenter;
  });
  return pullRequest;
};

export const issueReminderTask = task({
  // This is the unique identifier for your Job, it must be unique across all Jobs in your project.
  id: "issue-reminder-job",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: {
    issueNumber: number;
    repo: string;
    owner: string;
    commenter: string;
    installationId: number;
  }) => {
    const { issueNumber, repo, owner, commenter, installationId } = payload;
    const octokit = getOctokitInstance(installationId);

    //wait for 36hrs
    logger.info("Waiting for 36 hours");
    await wait.for({ seconds: 5 });

    //made this a task so it doesn't get replayed
    const taskValue = async () => {
      const pullRequest = await findPullRequestByIssueAndCommenter(
        octokit,
        owner,
        repo,
        issueNumber,
        commenter
      );

      if (!!pullRequest) {
        logger.info("pull request has been created for the issue after 36hrs");
        return { completed: true };
      } else {
        //send a comment reminder to the issue
        logger.info("pull request has not been created for the issue after 36hrs, sending a reminder");
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: ` @${commenter}, Just a little reminder: Please open a draft PR linking this issue within 12 hours. If we can't detect a PR, you will be unassigned automatically. `,
        });
        return { completed: false };
      }
    };

    if ((await taskValue()).completed) {
      return;
    } else {
      logger.info("waiting for 12hrs");
      await wait.for({ seconds: 60 });

      const pullRequest = await findPullRequestByIssueAndCommenter(
        octokit,
        owner,
        repo,
        issueNumber,
        commenter
      );

      if (!!pullRequest) {
        logger.info("pull request has been created for the issue within 48hrs");
        return;
      } else {
        logger.info("pull request has not been created for the issue after 12hrs");
        await octokit.issues.createComment({
          owner: owner,
          repo: repo,
          issue_number: issueNumber,
          body: `@${commenter} has not opened a PR for this issue within 48 hours. They have been unassigned from the issue, anyone can now take it up :)`,
        });
        await octokit.issues.removeAssignees({
          owner: owner,
          repo: repo,
          issue_number: issueNumber,
          assignees: [commenter],
        });
      }
    }
  },
});
