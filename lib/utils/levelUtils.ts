import { TLevel } from "@/types/level";
import { TRepository } from "@/types/repository";

export interface LevelProgress {
  totalPointsNeededToReachNextLevel: number;
  progressMadeInThisLevel: number;
}

export interface ModifiedTagsArray {
  levelId: string;
  assignableIssues: string[];
  nonAssignableIssues: string[];
}

export const calculateLevelProgress = (
  totalPoints: number,
  currentLevel: TLevel | null,
  nextLevel: TLevel | null
): LevelProgress => {
  if (!currentLevel) {
    return { totalPointsNeededToReachNextLevel: 0, progressMadeInThisLevel: 0 };
  }
  if (!nextLevel) {
    // if no next level this means user is in the last level thus 1
    return { totalPointsNeededToReachNextLevel: 1, progressMadeInThisLevel: 1 };
  }

  const totalPointsNeededToReachNextLevel = nextLevel.pointThreshold - currentLevel.pointThreshold;
  const progressMadeInThisLevel =
    (totalPoints - currentLevel.pointThreshold) / totalPointsNeededToReachNextLevel;
  return {
    totalPointsNeededToReachNextLevel: totalPointsNeededToReachNextLevel,
    progressMadeInThisLevel: progressMadeInThisLevel,
  };
};

export const calculateAssignabelNonAssignableIssuesForUserInALevel = (levels: TLevel[]) => {
  const sortedLevels = levels.sort((a, b) => a.pointThreshold - b.pointThreshold);

  // Collect all tags from the sorted levels
  const allTags = sortedLevels.reduce((tags, level) => {
    const levelTags = level.permissions.issueLabels.map((tag) => tag.text);
    return [...tags, ...levelTags];
  }, []);

  const modifiedArray: ModifiedTagsArray[] = [];

  sortedLevels.forEach((level, index) => {
    const levelTags = level.permissions.issueLabels.map((tag) => tag.text); //creates an array of tags(text) for this level in the map/loop.

    const assignableIssues =
      index > 0 ? [...modifiedArray[index - 1].assignableIssues, ...levelTags] : [...levelTags]; //makes an array of assignable issues/tags i.e issues of just previous level and the current level in map/loop. The previous level will always have all tags of its previous level and so on.

    const nonAssignableIssues = allTags.filter((tag) => !assignableIssues.includes(tag)); //makes an array of all tags that are not assignable for this level by removing the tags of the upcoming next levels from the allTags array.

    modifiedArray.push({ levelId: level.id, assignableIssues, nonAssignableIssues }); //pushing it into final array.
  });

  return modifiedArray;
};
export const findCurrentAndNextLevelOfCurrentUser = (repository: TRepository, totalPoints: number) => {
  // Find the levels whose threshold is just less amd just higher than the users total points in a repo.
  let currentLevelOfUser: TLevel | null = null;
  let nextLevelForUser: TLevel | null = null;
  let highestThreshold = -1;

  for (const level of repository.levels) {
    if (level.pointThreshold <= totalPoints && level.pointThreshold > highestThreshold) {
      currentLevelOfUser = level;
      highestThreshold = level.pointThreshold;
    } else if (
      level.pointThreshold > totalPoints &&
      (nextLevelForUser === null || level.pointThreshold < nextLevelForUser.pointThreshold)
    ) {
      nextLevelForUser = level;
    }
  }

  return { currentLevelOfUser, nextLevelForUser };
};
