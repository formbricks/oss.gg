import { extractIssueNumbers, getOctokitInstance } from "@/lib/github/utils";
import { triggerDotDevClient } from "@/trigger";
import { Octokit } from "@octokit/rest";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";

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
  const pullRequest = pullRequests.find(async (pr) => {
    const openedBy = pr.user?.login;
    const prBody = pr.body;
    const prIssueNumber = extractIssueNumbers(prBody!);

    // Return the PR that matches the issue number and belongs to the commenter
    return prIssueNumber.includes(issueNumber) && openedBy === commenter;
  });

  return pullRequest;
};

triggerDotDevClient.defineJob({
  // This is the unique identifier for your Job, it must be unique across all Jobs in your project.
  id: "issue-reminder-job",
  name: "issue reminder job",
  version: "0.0.1",
  // This is triggered by an event using eventTrigger. You can also trigger Jobs with webhooks, on schedules, and more: https://trigger.dev/docs/documentation/concepts/triggers/introduction
  trigger: eventTrigger({
    name: "issue.reminder",
    schema: z.object({
      issueNumber: z.number(),
      repo: z.string(),
      owner: z.string(),
      commenter: z.string(),
      installationId: z.number(),
    }),
  }),
  run: async (payload, io, ctx) => {
    const { issueNumber, repo, owner, commenter, installationId } = payload;
    const octokit = getOctokitInstance(installationId);

    //wait for 36hrs
    await io.wait("waiting for 36hrs", 36 * 60 * 60);

    //made this a task so it doesn't get replayed
    const taskValue = await io.runTask("36-hrs", async () => {
      const pullRequest = await findPullRequestByIssueAndCommenter(
        octokit,
        owner,
        repo,
        issueNumber,
        commenter
      );

      if (!!pullRequest) {
        io.logger.info("pull request has been created for the issue after 36hrs");
        return { completed: true };
      } else {
        //send a comment reminder to the issue
        io.logger.info("pull request has not been created for the issue after 36hrs, sending a reminder");
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: ` @${commenter}, You have 12hrs left to create a pull request for this issue. `,
        });
        return { completed: false };
      }
    });

    if (taskValue?.completed) {
      return;
    } else {
      await io.wait("waiting for 12hrs", 12 * 60 * 60);

      await io.runTask("48-hrs", async () => {
        const pullRequest = await findPullRequestByIssueAndCommenter(
          octokit,
          owner,
          repo,
          issueNumber,
          commenter
        );

        if (!!pullRequest) {
          io.logger.info("pull request has been created for the issue within 48hrs");
          return;
        } else {
          io.logger.info("pull request has not been created for the issue after 12hrs");
          await octokit.issues.createComment({
            owner: owner,
            repo: repo,
            issue_number: issueNumber,
            body: `@${commenter} has been unassigned from the issue, anyone can now take it up.`,
          });
          await octokit.issues.removeAssignees({
            owner: owner,
            repo: repo,
            issue_number: issueNumber,
            assignees: [commenter],
          });
        }
      });
    }
  },
});
