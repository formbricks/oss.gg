import { GITHUB_APP_ACCESS_TOKEN } from "@/lib/constants";
import { type TGithubUserData, ZGithubUserData } from "@/types/githubUser";
// Adjust the import path as needed
import { Octokit } from "@octokit/rest";

import { githubUserCache } from "./cache";
import { withCache } from "@/lib/cache";

export const getGithubUserByLogin = (githubLogin: string): Promise<TGithubUserData | false> =>
  withCache(
    async () => {
      try {
        const octokit = new Octokit({ auth: `token ${GITHUB_APP_ACCESS_TOKEN}` });
        const { data } = await octokit.rest.users.getByUsername({
          username: githubLogin,
        });

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
      } catch (error) {
        console.error("Error fetching or validating GitHub user data:", error);
        return false;
      }
    },
    githubUserCache.tags.byGithubLogin(githubLogin),
    {
      revalidate: 7 * 24 * 60 * 60, // 7 days
    }
  )
