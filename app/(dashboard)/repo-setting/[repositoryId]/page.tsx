import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Repo settings",
  description: "Set up oss.gg to work well with your repo and community",
};

export default async function RepoSettings() {
  //Do some sort of authorization to check if the user is allowed to access this page

  //TODO: fetch all the players in the repo
  //TODO: make the UI a component

  //   const user = await getCurrentUser();
  //   if (!user) {
  //     redirect(authOptions?.pages?.signIn || "/login");
  //   }

  //   const repos = await getRepositoriesForUser(user.id);

  const players = [
    {
      id: 1,
      name: "Player 1",
      points: 1200,
    },
    {
      id: 2,
      name: "Player 2",
      points: 1000,
    },
    {
      id: 3,
      name: "Player 3",
      points: 800,
    },
    //make it up to 10
    {
      id: 4,
      name: "Player 4",
      points: 600,
    },
    {
      id: 5,
      name: "Player 5",
      points: 500,
    },
    {
      id: 6,
      name: "Player 6",
      points: 400,
    },
    {
      id: 7,
      name: "Player 7",
      points: 300,
    },
    {
      id: 8,
      name: "Player 8",
      points: 200,
    },
    {
      id: 9,
      name: "Player 9",
      points: 100,
    },
    {
      id: 10,
      name: "Player 10",
      points: 50,
    },
  ];

  return (
    <div>
      {players.map((player) => (
        <div className="flex w-full items-center justify-between border-b border-gray-200 py-4">
          <div className="flex items-center gap-3">
            <p>#{player.id}</p>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p>{player.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="destructive">Kick and Block</Button>
            <Button variant="secondary">Mute</Button>
            <Button variant="secondary">Change points</Button>
            <p>
              {player.points} <span>points</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
