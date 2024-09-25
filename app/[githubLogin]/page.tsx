import { getGithubUserByLogin } from "@/lib/githubUser/service";
import { Metadata } from "next";

import ProfilePage from "./components/profile-page";
import { getCurrentUser } from "@/lib/session";

export async function generateMetadata({ params }: { params: { githubLogin: string } }): Promise<Metadata> {
  const githubUser = await getGithubUserByLogin(params.githubLogin);
  return {
    title: `${githubUser && "name" in githubUser ? githubUser.name : "Profile"} | oss.gg`,
  };
}

export default async function Page({ params }: { params: { githubLogin: string } }) {
  const sessionUser = await getCurrentUser();

  let doesUserExist = false;

  if (sessionUser) {
    doesUserExist = !!sessionUser.id;
  }

  return <ProfilePage githubLogin={params.githubLogin} singedIn={doesUserExist} />;
}
