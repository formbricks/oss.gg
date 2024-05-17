import UserProfileSummary from "@/components/ui/userProfileSummary";
import { getUsersForRepository } from "@/lib/repository/service";

export const metadata = {
  title: "Player overview",
  description: "This is a list of all players currently playing at this repository.",
};

export default async function RepoSettings({ params }) {
  const players = await getUsersForRepository(params.repositoryId);

  const arrayOfPlayersWithTheirTotalPoints = players.map((player) => {
    const totalPointsForThisSinglePlayer = player.pointTransactions.reduce((acc, pt) => acc + pt.points, 0);
    return {
      ...player,
      totalPointsForThisSinglePlayer: totalPointsForThisSinglePlayer,
    };
  });

  // Sort users by total points in descending order
  const arrayOfUsersInRepoInDescendingOrder = arrayOfPlayersWithTheirTotalPoints.sort(
    (a, b) => b.totalPointsForThisSinglePlayer - a.totalPointsForThisSinglePlayer
  );

  return (
    <div>
      {players.length === 0 ? (
        <p>No players enrolled in this repository.</p>
      ) : (
        <div>
          {arrayOfUsersInRepoInDescendingOrder.map((player, idx) => (
            <UserProfileSummary
              key={player.id}
              name={player.name || player.login}
              points={player.totalPointsForThisSinglePlayer}
              avatarUrl={player.avatarUrl || ""}
              userGitHubId={player.login}
              index={idx + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
