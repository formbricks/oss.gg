import "server-only";

import { ZGithubApiResponseSchema } from "@/types/issue";
import { unstable_cache } from "next/cache";

import { GITHUB_APP_ACCESS_TOKEN, GITHUB_CACHE_REVALIDATION_INTERVAL, OSS_GG_LABEL } from "../constants";

export const getMergedPullRequestsByGithubLogin = (repo: string, githubLogin: string) =>
  unstable_cache(
    async () => {
      const url = `https://api.github.com/search/issues?q=repo:${repo}+is:pull-request+is:merged+author:${githubLogin}&per_page=10&sort=created&order=desc`;

      const headers = {
        Authorization: `Bearer ${GITHUB_APP_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      };

      const response = await fetch(url, { headers });
      const data = await response.json();

      const validatedData = ZGithubApiResponseSchema.parse(data);

      // Map the GitHub API response to  issue format
      const mergedPRs = validatedData.items.map((pr) => ({
        logoUrl: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
        href: pr.html_url,
        title: pr.title,
        author: pr.user.login,
        key: pr.id.toString(),
        isIssue: false,
      }));

      return mergedPRs;
    },
    [`getMergedPullRequests-${repo}-${githubLogin}`],
    {
      revalidate: GITHUB_CACHE_REVALIDATION_INTERVAL,
    }
  )();

export const getOpenPullRequestsByGithubLogin = (repo: string, githubLogin: string) =>
  unstable_cache(
    async () => {
      const url = `https://api.github.com/search/issues?q=repo:${repo}+is:pull-request+is:open+author:${githubLogin}&sort=created&order=desc`;

      const headers = {
        Authorization: `Bearer ${GITHUB_APP_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      };

      const response = await fetch(url, { headers });
      const data = await response.json();

      const validatedData = ZGithubApiResponseSchema.parse(data);

      // Map the GitHub API response to  issue format
      const openPRs = validatedData.items.map((pr) => ({
        logoUrl: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
        href: pr.html_url,
        title: pr.title,
        author: pr.user.login,
        key: pr.id.toString(),
        state: pr.state,
        draft: pr.draft,
        isIssue: false,
      }));

      return openPRs;
    },
    [`getOpenPullRequests-${repo}-${githubLogin}`],
    {
      revalidate: GITHUB_CACHE_REVALIDATION_INTERVAL,
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

      // Map the GitHub API response to issue format
      const openPRs = validatedData.items.map((pr) => {
        // Map the points label as number
        const pointsLabel = pr.labels.find((label) => label.name.includes("points"));

        let points: number | null = null;
        if (pointsLabel) {
          const match = pointsLabel.name.match(/(\d+)/); // This regex matches any sequence of digits
          if (match) {
            points = parseInt(match[0], 10); // Convert the first matching group to an integer
          }
        }

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
          points,
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
