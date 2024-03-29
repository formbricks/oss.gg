import { ITEMS_PER_PAGE } from "@/lib/constants";
import { getPointsOfUsersInRepoByRepositoryId } from "@/lib/points/service";
import { getRepositoryById } from "@/lib/repository/service";

import Leaderboard from "./components/Leaderboard";

export default async function LeaderBoardPage({ params }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }

  const leaderboardProfiles = await getPointsOfUsersInRepoByRepositoryId(repository.id, 1);

  return (
    <>
      <Leaderboard
        leaderboardProfiles={leaderboardProfiles}
        itemPerPage={ITEMS_PER_PAGE}
        repositoryId={repository.id}
      />
    </>
  );
}
