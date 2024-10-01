import { TGithubUserData } from "@/types/githubUser";
import { TRepository } from "@/types/repository";
import { TUser } from "@/types/user";
import { PrismaClient } from "@prisma/client";

import { getEnrolledRepositories } from "../enrollment/service";
import { getGithubUserByLogin } from "../githubUser/service";
import { getPlayerByLogin } from "../user/service";

const db = new PrismaClient();

type EnrichedUserData = {
  githubData: TGithubUserData;
  playerData: TUser | null;
  enrolledRepositories: TRepository[] | null;
  status: {
    githubUserFound: boolean;
    playerFound: boolean;
    isEnrolled: boolean;
    hasAccount: boolean; // Add this new status
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
    enrolledRepositories: [] as TRepository[],
    status: {
      githubUserFound: !!githubUserData,
      playerFound: false,
      isEnrolled: false,
      hasAccount: false, // Initialize hasAccount to false
    },
  };

  // If GitHub user was found, try to get player data
  if (githubUserData) {
    const playerData = await getPlayerByLogin(githubLogin);
    console.log("playerData:", playerData); // Debug log

    if (playerData !== null) {
      // Check if the player has an associated account
      const hasAccount =
        (await db.account.findUnique({
          where: { userId: playerData.id },
          select: { id: true },
        })) !== null;

      result.playerData = playerData;
      result.status.playerFound = true;
      result.status.hasAccount = hasAccount;
      // If player was found, get enrolled repositories
      const enrolledRepositories = await getEnrolledRepositories(playerData.id);

      if (enrolledRepositories && enrolledRepositories.length > 0) {
        result.enrolledRepositories = enrolledRepositories;
        result.status.isEnrolled = true;
      }
    } else {
      result.status.playerFound = false;
      result.status.hasAccount = false;
    }
  }

  return result;
}
