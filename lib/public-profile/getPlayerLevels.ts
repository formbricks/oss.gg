import { TLevel } from "@/types/level";
// Adjust the import path as needed
import { TRepository } from "@/types/repository";

// You'll need to create this type if it doesn't exist

// Create a new type for the result of the mapping operation
type TUserLevelInRepo = {
  currentLevelOfUser: TLevel | null;
  repoLogo: string;
};

// Assuming you have a type for the enriched user data
interface EnrichedUserData {
  playerData: {
    id: string;
  } | null;
  enrolledRepositories: TRepository[] | null;
  // ... other properties
}

// Type the functions properly
async function getPointsForPlayerInRepoByRepositoryId(
  repositoryId: string,
  playerId: string
): Promise<number> {
  // Implementation here
}

function findCurrentAndNextLevelOfCurrentUser(
  repositoryId: string,
  totalPoints: number
): {
  currentLevelOfUser: TLevel | null;
  nextLevelForUser: TLevel | null;
} {
  // Implementation here
}

// Now, let's use these types in your code
async function getUserLevels(enrichedUserData: EnrichedUserData): Promise<TUserLevelInRepo[]> {
  if (enrichedUserData.enrolledRepositories) {
    const arrayCurrentLevelOfUserInEnrolledRepos = await Promise.all(
      enrichedUserData.enrolledRepositories.map(async (enrolledRepository): Promise<TUserLevelInRepo> => {
        const totalPointsForUserInThisRepo = await getPointsForPlayerInRepoByRepositoryId(
          enrolledRepository.id,
          enrichedUserData.playerData?.id || ""
        );
        const { currentLevelOfUser } = findCurrentAndNextLevelOfCurrentUser(
          enrolledRepository.id,
          totalPointsForUserInThisRepo
        );
        return {
          currentLevelOfUser: currentLevelOfUser,
          repoLogo: enrolledRepository?.logoUrl || "",
        };
      })
    );
    return arrayCurrentLevelOfUserInEnrolledRepos;
  }
  return [];
}
