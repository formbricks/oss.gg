import LevelDetailCard from "@/components/ui/level-detail-card";
import { authOptions } from "@/lib/auth";
import { getPointsForPlayerInRepoByRepositoryId } from "@/lib/points/service";
import { getRepositoryById } from "@/lib/repository/service";
import { getCurrentUser } from "@/lib/session";
import {
  ModifiedTagsArray,
  calculateAssignabelNonAssignableIssuesForUserInALevel,
  findCurrentAndNextLevelOfCurrentUser,
} from "@/lib/utils/levelUtils";
import { TLevel } from "@/types/level";
import { redirect } from "next/navigation";

export default async function Levels({ params: { repositoryId } }) {
  const repository = await getRepositoryById(repositoryId);

  if (!repository) {
    throw new Error("Repository not found");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const levels: TLevel[] = repository.levels as TLevel[];

  // Sort levels based on point threshold in ascending order to get tags in correct order of levels.
  const sortedLevels = levels.sort((a, b) => a.pointThreshold - b.pointThreshold);

  const modifiedTagsArray: ModifiedTagsArray[] =
    calculateAssignabelNonAssignableIssuesForUserInALevel(sortedLevels);

  const totalPointsForUserInThisRepo: number = await getPointsForPlayerInRepoByRepositoryId(
    repositoryId,
    user.id
  );

  const { currentLevelOfUser, nextLevelForUser } = await findCurrentAndNextLevelOfCurrentUser(
    repository.id,
    totalPointsForUserInThisRepo
  );

  return sortedLevels.length ? (
    sortedLevels.map((level, idx) => (
      <LevelDetailCard
        key={level.id}
        level={level} // this an item of the sortedLevels array.
        idx={idx + 1}
        modifiedTagsArray={modifiedTagsArray}
        totalPoints={totalPointsForUserInThisRepo}
        currentLevelOfUser={currentLevelOfUser}
        nextLevelForUser={nextLevelForUser}
        sortedLevels={sortedLevels}
      />
    ))
  ) : (
    <div className="mt-4">No Levels yet.</div>
  );
}
