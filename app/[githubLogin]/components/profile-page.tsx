import { getPullRequestsByGithubLogin } from "@/lib/github/service";
import { getPointsForPlayerInRepoByRepositoryId } from "@/lib/points/service";
import { getEnrichedGithubUserData } from "@/lib/public-profile/profileData";
import { getAllRepositories } from "@/lib/repository/service";
import { findCurrentAndNextLevelOfCurrentUser } from "@/lib/utils/levelUtils";
import { TLevel } from "@/types/level";

import LevelList from "./level-list";
import ProfileInfoBar from "./profile-info";

export default async function ProfilePage({ githubLogin }: { githubLogin: string }) {
  // Get & enrich the player data
  const enrichedUserData = await getEnrichedGithubUserData(githubLogin);

  // Get the level data if user is enrolled in any repositories
  let userLevels: { currentLevelOfUser: TLevel | null; repoLogo: string }[] = [];

  if (enrichedUserData.enrolledRepositories) {
    userLevels = await Promise.all(
      enrichedUserData.enrolledRepositories.map(async (enrolledRepository) => {
        const totalPointsForUserInThisRepo = await getPointsForPlayerInRepoByRepositoryId(
          enrolledRepository.id,
          enrichedUserData.playerData?.id || ""
        );
        const { currentLevelOfUser } = await findCurrentAndNextLevelOfCurrentUser(
          enrolledRepository.id,
          totalPointsForUserInThisRepo
        );
        return {
          currentLevelOfUser,
          repoLogo: enrolledRepository?.logoUrl || "",
        };
      })
    );
  }

  // Get the 20 most recent PRs of a user for all repositories signed up on oss.gg
  if (enrichedUserData.status.githubUserFound) {
    const ossGgRepositories = await getAllRepositories();
    const ossGgRepositoriesIds = ossGgRepositories.map((repo) => `${repo.owner}/${repo.name}`);
    const allPRs = await getPullRequestsByGithubLogin(ossGgRepositoriesIds, githubLogin);
    console.log(allPRs);
  }

  return (
    <div>
      <ProfileInfoBar githubData={enrichedUserData.githubData} />
      <div className="mt-10 grid grid-cols-4 gap-6 md:grid-cols-5">
        <LevelList levels={userLevels} />
        {/* <ContributionsList contributions={contributions} profileName={enrichedUserData.githubData.name} /> */}
      </div>
    </div>
  );
}
