import GitHubIssue from "@/components/ui/githubIssue";
import { db } from "@/lib/db";
import { getMergedPullRequests, getOpenPullRequests } from "@/lib/github/service";
import { getGithubUserByLogin } from "@/lib/githubUser/service";
import { getUserByLogin } from "@/lib/user/service";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

export const metadata = {
  title: "oss.gg Profile",
};

export default async function ProfilePage({ params }) {
  const githubLogin = params.githubLogin;

  const user = await getUserByLogin(githubLogin);

  if (user) {
    const userData = await getGithubUserByLogin(githubLogin);
    const mergedIssues = await getMergedPullRequests("formbricks/formbricks", githubLogin);
    const openPRs = await getOpenPullRequests("formbricks/formbricks", githubLogin);

    return (
      <div>
        <div className="z-40 -mt-36 grid grid-cols-5 gap-6 text-slate-50">
          <Image
            src={userData.avatar_url}
            alt="github avatar"
            width={180}
            height={180}
            className="col-span-1 rounded-md"
            priority={true}
          />
          <div className="col-span-4 flex items-center  space-x-6">
            <div className="">
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="mt-1 text-xs">{userData.bio}</p>
            </div>
            <Link href={`https://twitter.com/${userData.twitter_username}`} target="_blank">
              <FaTwitter
                className="h-8 w-8 transition-all duration-150 ease-in-out hover:scale-110"
                strokeWidth="1px"
              />
            </Link>

            <Link href={userData.html_url} target="_blank">
              <FaGithub
                className="h-8 w-8 transition-all duration-150 ease-in-out hover:scale-110"
                strokeWidth="1px"
              />
            </Link>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-5 gap-6">
          <div className="col-span-1 text-center">
            <h2 className="text-7xl text-gray-800">#3</h2> <p className="text-sm text-gray-500">of 727</p>
          </div>
          <div className="col-span-4">
            {openPRs && (
              <div>
                <h3 className="mb-2 text-xl font-medium">Open PRs @ Formbricks</h3>
                {openPRs.map((pr) => (
                  <GitHubIssue issue={pr} key={pr.title} />
                ))}
              </div>
            )}
            <div className="flex items-center space-x-3 rounded-lg border border-muted p-3">
              <div className="rounded-md border border-gray-200 bg-gray-50 p-2 text-3xl">🎉</div>
              <div>
                <p className="font-medium">{userData.name} enrolled at Formbricks</p>
                <p className="mt-0.5 text-xs">Let the games begin!</p>
              </div>
            </div>
            <h3 className="mb-2 mt-12 text-xl font-medium">Previous contributions at Formbricks</h3>
            {mergedIssues ? (
              mergedIssues.map((issue) => <GitHubIssue issue={issue} key={issue.title} />)
            ) : (
              <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-md bg-slate-50">
                <p>You have not yet contributed to Formbricks🕹️</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center">
        <p>User is not registered or does not exist.</p>
      </div>
    );
  }
}
