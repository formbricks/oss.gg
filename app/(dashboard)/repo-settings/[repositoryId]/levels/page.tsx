import LevelsFormContainer from "@/components/level-form-container";
import { authOptions } from "@/lib/auth";
import { getLevels } from "@/lib/levels/service";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Level settings",
  description: "Set up levels for your repository.",
};

export default async function Levels({ params: { repositoryId } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const levelsData = await getLevels(repositoryId);

  return <LevelsFormContainer levelsData={levelsData} />;
}
