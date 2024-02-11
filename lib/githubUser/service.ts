import { GITHUB_ACCESS_TOKEN, GITHUB_CACHE_REVALIDATION_INTERVAL } from "@/lib/constants";
import { Octokit } from "@octokit/rest";
import { unstable_cache } from "next/cache";

import { githubUserCache } from "./cache";

export const getGithubUserByLogin = (githubLogin: string) =>
  unstable_cache(
    async () => {
      try {
        const octokit = new Octokit({ auth: `token ${GITHUB_ACCESS_TOKEN}` });
        // Use the 'users' endpoint to get user data
        const { data } = await octokit.rest.users.getByUsername({
          username: githubLogin,
        });
        return data;
      } catch (error) {
        console.error("Error fetching GitHub user data:", error);
        return false;
      }
    },
    [`getGithubUserByLogin-${githubLogin}`],
    {
      tags: [githubUserCache.tag.byGithubLogin(githubLogin)],
      revalidate: GITHUB_CACHE_REVALIDATION_INTERVAL,
    }
  )();

