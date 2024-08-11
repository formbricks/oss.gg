import "server-only";

import { ZGithubApiResponseSchema } from "@/types/issue";
import { TPullRequest, ZPullRequest } from "@/types/pullRequest";
import { Octokit } from "@octokit/rest";
import { unstable_cache } from "next/cache";

import { GITHUB_APP_ACCESS_TOKEN, GITHUB_CACHE_REVALIDATION_INTERVAL, OSS_GG_LABEL } from "../constants";
import { extractPointsFromLabels } from "./utils";

type PullRequestStatus = "open" | "merged" | "closed" | undefined;

const octokit = new Octokit({ auth: GITHUB_APP_ACCESS_TOKEN });

export const getPullRequestsByGithubLogin = async (
  playerRepositoryIds: string[],
  githubLogin: string,
  status?: PullRequestStatus
): Promise<TPullRequest[]> => {
  console.log(`Fetching pull requests for GitHub user: ${githubLogin}`);

  if (!playerRepositoryIds || playerRepositoryIds.length === 0) {
    console.warn("No repository IDs provided. Returning empty array.");
    return [];
  }

  const pullRequests: TPullRequest[] = [];

  let statusQuery = "is:pr";
  if (status === "open") statusQuery += " is:open";
  else if (status === "merged") statusQuery += " is:merged";
  else if (status === "closed") statusQuery += " is:closed -is:merged";

  const repoQuery = playerRepositoryIds.map((id) => `repo:${id}`).join(" ");
  const query = `${repoQuery} ${statusQuery} author:${githubLogin}`;
  console.log(`Search query: ${query}`);

  try {
    const { data } = await octokit.search.issuesAndPullRequests({
      q: query,
      per_page: 20,
      sort: "created",
      order: "desc",
    });

    console.log(`Found ${data.items.length} pull requests across all repositories`);

    for (const pr of data.items) {
      console.log(`Processing PR: ${pr.title}`);
      console.log(`Complete PR object: ${JSON.stringify(pr, null, 2)}`);

      let prStatus: "open" | "merged" | "closed";
      if (pr.state === "open") {
        prStatus = "open";
      } else if (pr.pull_request?.merged_at) {
        prStatus = "merged";
      } else {
        prStatus = "closed";
      }

      const prLabels = pr.labels.filter((label) => label.name !== undefined) as { name: string }[];

      try {
        const pullRequest: TPullRequest = ZPullRequest.parse({
          title: pr.title,
          href: pr.html_url,
          author: pr.user?.login || "",
          repositoryFullName: pr.repository_url.split("/").slice(-2).join("/"),
          dateOpened: pr.created_at,
          dateMerged: pr.pull_request?.merged_at || null,
          dateClosed: pr.closed_at,
          status: prStatus,
          points: prLabels ? extractPointsFromLabels(prLabels) : null,
        });

        pullRequests.push(pullRequest);
        console.log(`Successfully processed PR: ${pr.title}`);
      } catch (error) {
        console.error(`Error parsing pull request: ${pr.title}`, error);
      }
    }
  } catch (error) {
    console.error(`Error fetching or processing pull requests:`, error);
  }

  console.log(`Total pull requests fetched: ${pullRequests.length}`);

  // Sort pullRequests by dateOpened in descending order
  pullRequests.sort((a, b) => new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime());

  return pullRequests;
};

export const getAllOssGgIssuesOfRepo = (repoGithubId: number) =>
  unstable_cache(
    async () => {
      const githubHeaders = {
        Authorization: `Bearer ${GITHUB_APP_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      };
      const repoResponse = await fetch(`https://api.github.com/repositories/${repoGithubId}`, {
        headers: githubHeaders,
      });
      const repoData = await repoResponse.json();

      const issuesResponse = await fetch(
        `https://api.github.com/search/issues?q=repo:${repoData.full_name}+is:issue+is:open+label:"${OSS_GG_LABEL}"&sort=created&order=desc`,
        { headers: githubHeaders }
      );
      const issuesData = await issuesResponse.json();
      const validatedData = ZGithubApiResponseSchema.parse(issuesData);

      // Map the GitHub API response to issue format
      const openPRs = validatedData.items.map((pr) => {
        return {
          logoUrl: `https://avatars.githubusercontent.com/u/${repoData.owner.id}?s=200&v=4`,
          href: pr.html_url,
          title: pr.title,
          author: pr.user.login,
          repository: repoData.name,
          key: pr.id.toString(),
          state: pr.state,
          draft: pr.draft,
          isIssue: true,
          labels: pr.labels.map((label) => label.name),
          points: extractPointsFromLabels(pr.labels),
          assignee: pr.assignee ? pr.assignee.login : null,
          createdAt: pr.created_at,
          updatedAt: pr.updated_at,
          closedAt: pr.closed_at,
        };
      });
      return openPRs;
    },
    [`getOpenPullRequests-${repoGithubId}`],
    {
      revalidate: GITHUB_CACHE_REVALIDATION_INTERVAL,
    }
  )();
