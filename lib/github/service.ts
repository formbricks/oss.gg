import "server-only";

import { ZGithubApiResponseSchema } from "@/types/issue";
import { TPullRequest, ZPullRequest } from "@/types/pullRequest";
import { Octokit } from "@octokit/rest";
import { unstable_cache } from "next/cache";

import { GITHUB_APP_ACCESS_TOKEN, OSS_GG_LABEL } from "../constants";
import { githubCache } from "./cache";
import { extractPointsFromLabels } from "./utils";

type PullRequestStatus = "open" | "merged" | "closed" | undefined;

const octokit = new Octokit({ auth: GITHUB_APP_ACCESS_TOKEN });

export const getPullRequestsByGithubLogin = (
  playerRepositoryIds: string[],
  githubLogin: string,
  status?: PullRequestStatus
) =>
  unstable_cache(
    async (): Promise<TPullRequest[]> => {
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

      try {
        const { data } = await octokit.search.issuesAndPullRequests({
          q: query,
          per_page: 20,
          sort: "created",
          order: "desc",
        });

        for (const pr of data.items) {
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
          } catch (error) {
            console.error(`Error parsing pull request: ${pr.title}`, error);
          }
        }
      } catch (error) {
        console.error(`Error fetching or processing pull requests:`, error);
      }

      // Sort pullRequests by dateOpened in descending order
      pullRequests.sort((a, b) => new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime());

      return pullRequests;
    },
    [`getPullRequests-${githubLogin}-${status}-${playerRepositoryIds.join(",")}`],
    {
      tags: [githubCache.tag.byGithubLogin(githubLogin)],
      revalidate: 60 * 20, // 20 minutes
    }
  )();

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

      // Map the GitHub API response to TPullRequest format
      const openIssues: TPullRequest[] = validatedData.items.map((issue) => {
        return ZPullRequest.parse({
          title: issue.title,
          href: issue.html_url,
          author: issue.user.login,
          repositoryFullName: repoData.full_name,
          dateOpened: issue.created_at,
          dateMerged: null, // Issues don't have a merged date
          dateClosed: issue.closed_at,
          status: "open", // All fetched issues are open
          points: extractPointsFromLabels(issue.labels),
        });
      });
      return openIssues;
    },
    [`getOpenIssues-${repoGithubId}`],
    {
      tags: [githubCache.tag.byRepoGithubId(repoGithubId)],
      revalidate: 60 * 20,
    }
  )();
