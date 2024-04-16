import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsersForRepository } from "@/lib/repository/service";

export const metadata = {
  title: "Player overview",
  description: "This is a list of all players currently playing at this repository.",
};

export default async function RepoSettings({ params }) {
  const players = await getUsersForRepository(params.repositoryId);

  return (
    <div>
      {players.length === 0 ? (
        <p>No players enrolled in this repository.</p>
      ) : (
        // Replace with Leaderboard component
        <div>
          {players.map((player) => (
            <div
              className="flex w-full items-center justify-between border-b border-gray-200 py-4"
              key={player.id}>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p>{player.name}</p>
              </div>
              <div className="flex items-center gap-3"></div>
            </div>
          ))}{" "}
        </div>
      )}
    </div>
  );
}
