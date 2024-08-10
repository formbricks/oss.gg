import { getMergedPullRequestsByGithubLogin, getOpenPullRequestsByGithubLogin } from "../github/service";
import { getPointsForPlayerInRepoByRepositoryId } from "../points/service";
import { findCurrentAndNextLevelOfCurrentUser } from "../utils/levelUtils";

export async function getPlayerContributions(githubLogin: string, playerRepositoryIds: string[]) {
  const [mergedIssues, openPRs] = await Promise.all([
    getMergedPullRequestsByGithubLogin(playerRepositoryIds, githubLogin),
    getOpenPullRequestsByGithubLogin(playerRepositoryIds, githubLogin),
  ]);

  const userLevels = await Promise.all(
    playerRepositoryIds.map(async (playerRepositoryId) => {
      const totalPoints = await getPointsForPlayerInRepoByRepositoryId(playerRepositoryId, githubLogin);
      const { currentLevelOfUser } = await findCurrentAndNextLevelOfCurrentUser(
        playerRepositoryId,
        totalPoints
      );
      return { playerRepositoryId, currentLevelOfUser };
    })
  );

  return { mergedIssues, openPRs, userLevels };
}
