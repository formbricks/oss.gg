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
      per_page: 99,
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

  pullRequests.sort((a, b) => new Date(b.dateOpened).getTime() - new Date(a.dateOpened).getTime());

  return pullRequests;
};

export const getPullRequestsByGithubLogin = unstable_cache(
  fetchPullRequestsByGithubLogin,
  ["fetchPullRequestsByGithubLogin"],
  { revalidate: 60 }
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
