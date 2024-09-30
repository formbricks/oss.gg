import { GITHUB_APP_ACCESS_TOKEN } from "@/lib/constants";
import { TGithubUserData, ZGithubUserData } from "@/types/githubUser";
// Adjust the import path as needed
import { Octokit } from "@octokit/rest";
import { unstable_cache } from "next/cache";

import { githubUserCache } from "./cache";

export const getGithubUserByLogin = (githubLogin: string): Promise<TGithubUserData | false> =>
  unstable_cache(
    async () => {
      try {
        const octokit = new Octokit({ auth: `token ${GITHUB_APP_ACCESS_TOKEN}` });
        const { data } = await octokit.rest.users.getByUsername({
          username: githubLogin,
        });

        const rateLimit = await octokit.rest.rateLimit.get();
        console.log("Rate limit info:", rateLimit.data);

        // Map the API response to our TGithubUserData type
        const mappedData = {
          name: data.name || githubLogin, // Use login as fallback if name is null
          avatar_url: data.avatar_url,
          bio: data.bio || "", // Provide an empty string if bio is null
          twitter_username: data.twitter_username || undefined,
          html_url: data.html_url,
        };

        // Validate the mapped data using Zod
        const validatedData = ZGithubUserData.parse(mappedData);

        return validatedData;
      } catch (error: any) {
        // Check for specific error codes
        if (error.status === 401) {
          console.error("Authentication failed. Invalid or expired token:", error);
        } else if (error.status === 403 && error.response?.headers["x-ratelimit-remaining"] === "0") {
          console.error("Rate limit exceeded for unauthenticated requests:", error);
        } else {
          console.error("Error fetching or validating GitHub user data:", error);
        }
        return false;
      }
    },
    [`getGithubUserByLogin-${githubLogin}`],
    {
      tags: [githubUserCache.tag.byGithubLogin(githubLogin)],
      revalidate: 60 * 60 * 24 * 7, // 1 week
    }
  )();
