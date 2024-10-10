import { getAllUserPointsList } from "@/lib/points/service";

import LeaderBoard from "./components";

export default async function Page() {
  const allUserPoints = await getAllUserPointsList();
  return <LeaderBoard allUserPoints={allUserPoints} />;
}
