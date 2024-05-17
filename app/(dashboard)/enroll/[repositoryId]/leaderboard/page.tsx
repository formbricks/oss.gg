import { ITEMS_PER_PAGE } from "@/lib/constants";
import { getPointsOfUsersInRepoByRepositoryId } from "@/lib/points/service";
import { getRepositoryById } from "@/lib/repository/service";
import { TLevel } from "@/types/level";

import Leaderboard from "./components/Leaderboard";

export default async function LeaderboardPage({ params }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }

  const leaderboardProfiles = await getPointsOfUsersInRepoByRepositoryId(repository.id, 1);

  const levels: TLevel[] = repository.levels as TLevel[];
  const sortedLevels = levels.sort((a, b) => b.pointThreshold - a.pointThreshold); //descending by threshold

  return (
    <>
      {leaderboardProfiles.length === 0 ? (
        <p className="mt-4">No users found in the leaderboard.</p>
      ) : (
        <Leaderboard
          leaderboardProfiles={leaderboardProfiles}
          itemPerPage={ITEMS_PER_PAGE}
          repositoryId={repository.id}
          sortedLevels={sortedLevels}
        />
      )}
    </>
  );
}
