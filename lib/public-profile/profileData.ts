import { TGithubUserData } from "@/types/githubUser";
import { TRepository } from "@/types/repository";
import { TUser } from "@/types/user";

import { getEnrolledRepositories } from "../enrollment/service";
import { getGithubUserByLogin } from "../githubUser/service";
import { getPlayerByLogin } from "../user/service";

type EnrichedUserData = {
  githubData: TGithubUserData;
  playerData: TUser | null;
  enrolledRepositories: TRepository[] | null;
  status: {
    githubUserFound: boolean;
    playerFound: boolean;
    isEnrolled: boolean;
  };
};
const placeholderData = {
  name: "Rick Astley",
  avatar_url: "/rick.webp",
  bio: "Never gonna give you up",
  html_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  twitter_username: "rickastley",
};

export async function getEnrichedGithubUserData(githubLogin: string): Promise<EnrichedUserData> {
  // First, try to get GitHub user data
  const githubUserData = await getGithubUserByLogin(githubLogin);

  // Initialize the result object
  const result: EnrichedUserData = {
    githubData: githubUserData || placeholderData,
    playerData: null,
    enrolledRepositories: null,
    status: {
      githubUserFound: !!githubUserData,
      playerFound: false,
      isEnrolled: false,
    },
  };

  // If GitHub user was found, try to get player data
  if (githubUserData) {
    const playerData = await getPlayerByLogin(githubLogin);

    if (playerData) {
      result.playerData = playerData;
      result.status.playerFound = true;

      // If player was found, get enrollments
      const enrolledRepositories = await getEnrolledRepositories(playerData.id);

      if (enrolledRepositories && enrolledRepositories.length > 0) {
        result.enrolledRepositories = enrolledRepositories;
        result.status.isEnrolled = true;
      }
    }
  }

  return result;
}
