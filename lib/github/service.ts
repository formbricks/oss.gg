import "server-only";

import { unstable_cache } from "next/cache";

import { GITHUB_ACCESS_TOKEN, GITHUB_CACHE_REVALIDATION_INTERVAL } from "../constants";

export const getMergedPullRequestsByGithubLogin = (repo: string, githubLogin: string) =>
  unstable_cache(
    async () => {
      const url = `https://api.github.com/search/issues?q=repo:${repo}+is:pull-request+is:merged+author:${githubLogin}&per_page=10&sort=created&order=desc`;

      const headers = {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      };

      const response = await fetch(url, { headers });
      const data = await response.json();

      // Map the GitHub API response to your issue format if necessary
      const mergedPRs = data.items.map((pr) => ({
        logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
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
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      };

      const response = await fetch(url, { headers });
      const data = await response.json();

      // Map the GitHub API response to your issue format if necessary
      const openPRs = data.items.map((pr) => ({
        logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
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

  export const getAllOpenIssuesOfRepo = (repo: string) =>
  unstable_cache(
    async () => {
      const url = `https://api.github.com/search/issues?q=repo:${repo}+is:issue+is:open+label:"🕹️ oss.gg"&sort=created&order=desc`;

      const headers = {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      };

      const response = await fetch(url, { headers });
      const data = await response.json();
      console.log(data)

      // Map the GitHub API response to issue format
      const openPRs = data.items.map((pr) => ({
        logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
        href: pr.html_url,
        title: pr.title,
        author: pr.user.login,
        key: pr.id.toString(),
        state: pr.state,
        draft: pr.draft,
        isIssue: true,
      }));

      return openPRs;
    },
    [`getOpenPullRequests-${repo}`],
    {
      revalidate: GITHUB_CACHE_REVALIDATION_INTERVAL,
    }
  )();