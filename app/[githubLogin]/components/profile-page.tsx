"use server";

import { getPullRequestsByGithubLogin } from "@/lib/github/service";
import { getPointsAndRankPerRepository, getTotalPointsAndGlobalRank } from "@/lib/points/service";
import { getEnrichedGithubUserData } from "@/lib/public-profile/profileData";
import { getAllRepositories } from "@/lib/repository/service";
import { TPullRequest } from "@/types/pullRequest";

import PointsAndRanks from "./point-list";
import PullRequestList from "./pr-list";
import ProfileInfoBar from "./profile-info";

export default async function ProfilePage({ githubLogin }: { githubLogin: string }) {
  // Get & enrich the player data
  const enrichedUserData = await getEnrichedGithubUserData(githubLogin);

  let pointsAndRanks: Array<{
    id: string;
    repositoryName: string;
    points: number;
    repositoryLogo?: string;
  }> = [];

  if (enrichedUserData.enrolledRepositories && enrichedUserData.playerData?.id) {
    try {
      const result = await getPointsAndRankPerRepository(
        enrichedUserData.enrolledRepositories,
        enrichedUserData.playerData.id
      );

      pointsAndRanks = result.map((item) => ({
        ...item,
        repositoryLogo: item.repositoryLogo || undefined,
      }));
    } catch (error) {}
  }

  let totalPoints = 0;
  let globalRank = 0;
  let chanceOfWinning = 0;
  if (enrichedUserData.playerData?.id) {
    const result = await getTotalPointsAndGlobalRank(enrichedUserData.playerData.id);
    totalPoints = result.totalPoints;
    globalRank = result.globalRank;
    chanceOfWinning = result.likelihoodOfWinning;
  }

  const ossGgRepositories = await getAllRepositories();

  let pullRequests = [] as TPullRequest[];

  if (enrichedUserData.status.githubUserFound) {
    const ossGgRepositoriesIds = ossGgRepositories.map((repo) => `${repo.owner}/${repo.name}`);
    pullRequests = await getPullRequestsByGithubLogin(ossGgRepositoriesIds, githubLogin);
  }

  return (
    <div className="flex max-w-2xl flex-col items-center justify-center pb-4 font-mono text-xs">
      <ProfileInfoBar
        githubData={enrichedUserData.githubData}
        totalPoints={totalPoints}
        globalRank={globalRank}
        chanceOfWinning={chanceOfWinning}
      />
      <div className="mt-10 grid w-full max-w-2xl grid-cols-4 gap-6 md:grid-cols-5">
        {/* <LevelList levels={userLevels} /> */}
        <PointsAndRanks pointsAndRanks={pointsAndRanks} />
        <PullRequestList pullRequests={pullRequests} signedUp={enrichedUserData.status.playerFound} />
      </div>
    </div>
  );
}
