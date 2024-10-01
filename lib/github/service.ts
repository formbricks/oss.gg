import "server-only";

import { ZGithubApiResponseSchema } from "@/types/issue";
import { TPullRequest, ZPullRequest } from "@/types/pullRequest";
import { Octokit } from "@octokit/rest";
import { unstable_cache } from "next/cache";

import { GITHUB_APP_ACCESS_TOKEN, OSS_GG_LABEL } from "../constants";
import { extractPointsFromLabels } from "./utils";

type PullRequestStatus = "open" | "merged" | "closed" | undefined;

const octokit = new Octokit({ auth: GITHUB_APP_ACCESS_TOKEN });

const fetchPullRequestsByGithubLogin = async (
  playerRepositoryIds: string[],
  githubLogin: string,
  status?: PullRequestStatus
): Promise<TPullRequest[]> => {
  console.log(`Fetching pull requests for GitHub login: ${githubLogin}`);
  console.log(`Repositories to check: ${playerRepositoryIds.join(", ")}`);
  console.log(`Status filter: ${status || "all"}`);

  if (!playerRepositoryIds || playerRepositoryIds.length === 0) {
    console.warn("No repository IDs provided. Returning empty array.");
    return [];
  }

  const pullRequests: TPullRequest[] = [];

  for (const repoId of playerRepositoryIds) {
    console.log(`Processing repository: ${repoId}`);
    const [owner, repo] = repoId.split("/");
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage && page <= 2) {
      // Fetch up to 2 pages (200 PRs)
      console.log(`Fetching page ${page} for ${repoId}`);
      try {
        const { data } = await octokit.pulls.list({
          owner,
          repo,
          state: status === "merged" ? "closed" : status || "all",
          sort: "created",
          direction: "desc",
          per_page: 100,
          page,
        });

        console.log(`Fetched ${data.length} pull requests for ${repoId} (page ${page})`);

        for (const pr of data) {
          if (pr.user?.login !== githubLogin) {
            console.log(`Skipping PR by ${pr.user?.login}, not matching ${githubLogin}`);
            continue;
          }

          let prStatus: "open" | "merged" | "closed";
          if (pr.state === "open") {
            prStatus = "open";
          } else if (pr.merged_at) {
            prStatus = "merged";
          } else {
            prStatus = "closed";
          }

          if (status && prStatus !== status) {
            console.log(`Skipping PR with status ${prStatus}, not matching filter ${status}`);
            continue;
          }

          try {
            const pullRequest: TPullRequest = ZPullRequest.parse({
              title: pr.title,
              href: pr.html_url,
              author: pr.user?.login || "",
              repositoryFullName: repoId,
              dateOpened: pr.created_at,
              dateMerged: pr.merged_at || null,
              dateClosed: pr.closed_at,
              status: prStatus,
              points: pr.labels ? extractPointsFromLabels(pr.labels) : null,
            });

            console.log(`Adding PR: ${pullRequest.title} (${pullRequest.status})`);
            pullRequests.push(pullRequest);
          } catch (error) {
            console.error(`Error parsing pull request: ${pr.title}`, error);
          }
        }

        hasNextPage = data.length === 100;
        page++;
      } catch (error) {
        console.error(`Error fetching pull requests for ${repoId} (page ${page}):`, error);
        hasNextPage = false;
      }
    }
  }

  console.log(`Total pull requests fetched: ${pullRequests.length}`);
  console.log(`pullRequests: ${JSON.stringify(pullRequests, null, 2)}`);
  pullRequests.sort((a, b) => new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime());
  console.log("Pull requests sorted by date opened (descending)");

  const rateLimit = await octokit.rest.rateLimit.get();
  console.log("Rate limit info:", rateLimit.data);

  return pullRequests;
};

export const getPullRequestsByGithubLogin = unstable_cache(
  fetchPullRequestsByGithubLogin,
  ["fetchPullRequestsByGithubLogin"],
  { revalidate: 60 * 5 }
);

const fetchAllOssGgIssuesOfRepos = async (
  repos: { id: number; fullName: string }[]
): Promise<TPullRequest[]> => {
  const githubHeaders = {
    Authorization: `Bearer ${GITHUB_APP_ACCESS_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  console.log(`Fetching issues for ${repos.length} repositories`);

  const allIssues = await Promise.all(
    repos.map(async (repo) => {
      const issuesUrl = `https://api.github.com/search/issues?q=repo:${repo.fullName}+is:issue+is:open+label:"${OSS_GG_LABEL}"+no:assignee&sort=created&order=desc`;
      console.log(`Fetching issues from: ${issuesUrl}`);

      const issuesResponse = await fetch(issuesUrl, { headers: githubHeaders });
      console.log(`Issues response status: ${issuesResponse.status}`);

      const rateLimit = issuesResponse.headers.get("X-RateLimit-Limit");
      const rateRemaining = issuesResponse.headers.get("X-RateLimit-Remaining");
      const rateReset = issuesResponse.headers.get("X-RateLimit-Reset");
      console.log(
        `Rate Limit: ${rateLimit}, Remaining: ${rateRemaining}, Reset: ${new Date(parseInt(rateReset ?? "0") * 1000)}`
      );

      const issuesData = await issuesResponse.json();
      console.log(`Fetched ${issuesData.total_count} issues for ${repo.fullName}`);

      const validatedData = ZGithubApiResponseSchema.parse(issuesData);
      console.log(`Validated ${validatedData.items.length} issues`);

      return validatedData.items.map((issue) => {
        console.log(`Processing issue: ${issue.title}`);
        return ZPullRequest.parse({
          title: issue.title,
          href: issue.html_url,
          author: issue.user.login,
          repositoryFullName: repo.fullName,
          dateOpened: issue.created_at,
          dateMerged: null,
          dateClosed: issue.closed_at,
          status: "open",
          points: extractPointsFromLabels(issue.labels),
        });
      });
    })
  );

  const flattenedIssues = allIssues.flat();
  console.log(`Total issues fetched and processed: ${flattenedIssues.length}`);

  return flattenedIssues;
};

export const getAllOssGgIssuesOfRepos = (repos: { id: number; fullName: string }[]) =>
  unstable_cache(
    async () => {
      console.log(`Cache MISS for getAllOssGgIssuesOfRepos`);
      return await fetchAllOssGgIssuesOfRepos(repos);
    },
    [
      `getAllOssGgIssuesOfRepos-${repos
        .map((r) => r.id)
        .sort((a, b) => a - b)
        .join("-")}`,
    ],
    { revalidate: 120 }
  )();
