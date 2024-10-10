import { getAllUserPointsList } from "@/lib/points/service";

import LeaderBoard from "./components";

export default async function Page() {
  const allUserPoints = await getAllUserPointsList();
  const filteredUserPoints = allUserPoints.filter((user) => user.totalPoints > 0);
  const totalPlayers = allUserPoints.length;
  return <LeaderBoard allUserPoints={filteredUserPoints} totalPlayers={totalPlayers} />;
}
