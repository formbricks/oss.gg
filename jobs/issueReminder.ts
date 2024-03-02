import { getOctokitInstance } from "@/lib/github/utils";
import { client } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";

client.defineJob({
  // This is the unique identifier for your Job, it must be unique across all Jobs in your project.
  id: "issue-remainder-job",
  name: "issue remainder job",
  version: "0.0.1",
  // This is triggered by an event using eventTrigger. You can also trigger Jobs with webhooks, on schedules, and more: https://trigger.dev/docs/documentation/concepts/triggers/introduction
  trigger: eventTrigger({
    name: "issue.remainder",
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
    await io.wait("waiting for 36hrs",36 * 60 * 60);

    //make this a task so that it can return the completed value from the prev run
    await io.runTask("pull-request-checker", async () => {
      const { data: issue } = await octokit.issues.get({
        owner: owner,
        repo: repo,
        issue_number: issueNumber,
      });

      if (issue.pull_request) {
        io.logger.info("pull request has been created for the issue after 36hrs");
        return;
      } else {
        //send a comment remainder to the issue
        io.logger.info("pull request has not been created for the issue after 36hrs, sending a reminder");
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: ` @${commenter}, You have 12hrs left to create a pull request for this issue. `,
        });
      }
    });

    await io.wait("waiting for 12hrs",12 * 60 * 60);

    await io.runTask("pull-request-checker-after-12hrs", async () => {
      const { data: issue } = await octokit.issues.get({
        owner: owner,
        repo: repo,
        issue_number: issueNumber,
      });

      if (issue.pull_request) {
        io.logger.info("pull request has been created for the issue after 12hrs");
        return
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

  },
});
