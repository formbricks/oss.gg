import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import GitHubIssue from "@/components/ui/githubIssue";
import { getEnrolledRepositories } from "@/lib/enrollment/service";
import { getMergedPullRequestsByGithubLogin, getOpenPullRequestsByGithubLogin } from "@/lib/github/service";
import { getGithubUserByLogin } from "@/lib/githubUser/service";
import { getPointsForUserInRepoByRepositoryId } from "@/lib/points/service";
import { getUserByLogin } from "@/lib/user/service";
import { findCurrentAndNextLevelOfCurrentUser } from "@/lib/utils/levelUtils";
import Rick from "@/public/rick.webp";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

export const metadata = {
  title: "oss.gg Profile",
};

const dummyIssues = [
  {
    logoUrl: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    title: "[FEATURE] Share survey results publicly",
    author: "jobenjada",
    points: 500,
    key: "0",
    isIssue: true,
  },
  {
    logoUrl: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: 500,
    key: "1",
    isIssue: true,
  },
  {
    logoUrl: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: 250,
    key: "2",
    isIssue: true,
  },
  {
    logoUrl: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: 300,
    key: "3",
    isIssue: true,
  },
  {
    logoUrl: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: 400,
    key: "4",
    isIssue: true,
  },
];

const ProfileInfo = ({ githubUserData }) => (
  <div className="z-40 -mt-24 grid grid-cols-5 gap-6 text-zinc-50 md:-mt-36">
    <Image
      src={githubUserData.avatar_url}
      alt="github avatar"
      width={180}
      height={180}
      className="z-50 col-span-2 rounded-md md:col-span-1"
      priority={true}
    />

    <div className="col-span-3 flex items-center space-x-6 md:col-span-4">
      <div>
        <h1 className="text-3xl font-bold">{githubUserData.name}</h1>
        <p className="mt-1 text-xs">{githubUserData.bio}</p>
      </div>

      {githubUserData.twitter_username && (
        <SocialLink href={`https://twitter.com/${githubUserData.twitter_username}`} Icon={FaTwitter} />
      )}
      <SocialLink href={githubUserData.html_url || "https://formbricks.com/github"} Icon={FaGithub} />
    </div>
  </div>
);

const SocialLink = ({ href, Icon }) => (
  <Link href={href} target="_blank" className="hidden md:block">
    <Icon className="h-8 w-8 transition-all duration-150 ease-in-out hover:scale-110" strokeWidth="1px" />
  </Link>
);

export default async function ProfilePage({ params }) {
  const githubLogin = params.githubLogin;
  const user = await getUserByLogin(githubLogin);

  if (user) {
    const userEnrollments = await getEnrolledRepositories(user?.id);

    const repos = userEnrollments.length > 0 ? [...userEnrollments].map((repo) => repo.name) : null; // get repo names from userEnrollments
    const [githubUserData, mergedIssues, openPRs] = await Promise.all([
      getGithubUserByLogin(githubLogin).then(
        (data) => data || { name: "Rick", avatar_url: Rick, bio: "is never gonna give you up 🕺" }
      ),
      getMergedPullRequestsByGithubLogin(repos, githubLogin),
      getOpenPullRequestsByGithubLogin(repos, githubLogin),
    ]);


    const arrayCurrentLevelOfUserInEnrolledRepos = await Promise.all(
      userEnrollments.map(async (repo) => {
        const totalPointsForUserInThisRepo = await getPointsForUserInRepoByRepositoryId(
          repo.id,
          user?.id || ""
        );
        const { currentLevelOfUser } = findCurrentAndNextLevelOfCurrentUser(
          repo,
          totalPointsForUserInThisRepo
        );
        return { currentLevelOfUser: currentLevelOfUser, repoLogo: repo?.logoUrl || "" };
      })
    );

    return (
      <div>
        <ProfileInfo githubUserData={githubUserData} />
        <div className="mt-10 grid grid-cols-4 gap-6   md:grid-cols-5">
          <div className="col-span-1 hidden  text-center  md:flex md:flex-col md:gap-8 ">
            {arrayCurrentLevelOfUserInEnrolledRepos.map((obj) => {
              if (!obj.currentLevelOfUser) return;
              return (
                <>
                  <div className="relative flex w-11/12 items-center justify-center rounded-lg bg-secondary py-3">
                    <Avatar className="h-40 w-40 ">
                      <AvatarImage src={obj.currentLevelOfUser?.iconUrl || ""} alt="level icon" />
                    </Avatar>
                    {obj.repoLogo && (
                      <div className="absolute left-0 top-0 -translate-x-1/3 -translate-y-1/3">
                        <Image
                          src={obj.repoLogo}
                          height={40}
                          width={40}
                          alt={"repo logo"}
                          className="rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </>
              );
            })}
          </div>
          <div className="col-span-4 space-y-12 ">
            {openPRs.length > 1 && (
              <div>
                <h3 className="mb-2 text-xl font-medium">Open PRs @ Formbricks by {githubUserData.name} </h3>
                {openPRs.map((pr) => (
                  <GitHubIssue issue={pr} key={pr.title} />
                ))}
              </div>
            )}
            {userEnrollments && (
              <div>
                <h3 className="mb-2 text-xl font-medium">Congrats! </h3>
                {userEnrollments.map((item) => (
                  <div
                    key={item.id}
                    className="mb-2 flex items-center space-x-3 rounded-lg border border-muted p-3">
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-2 text-3xl">🎉</div>
                    <div>
                      <p className="font-medium">
                        {githubUserData?.name} enrolled to contribute to {item.name}
                      </p>
                      <p className="mt-0.5 text-xs">Let the games begin!</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div>
              {mergedIssues.length > 1 ? (
                <>
                  <h3 className="mb-2 text-xl font-medium">
                    Contributions @ Formbricks by {githubUserData.name}
                  </h3>
                  {mergedIssues.map((issue) => (
                    <GitHubIssue issue={issue} key={issue.title} />
                  ))}
                </>
              ) : (
                <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-md bg-zinc-50">
                  <p>{githubUserData?.name} has not yet contributed to an oss.gg repository 🕹️</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    const gitHubData = (await getGithubUserByLogin(githubLogin)) || {
      name: "Rick Astley",
      avatar_url: Rick,
      bio: "Never gonna give you up",
    };
    return (
      <div>
        <ProfileInfo githubUserData={gitHubData} />
        <div className="grid grid-cols-4 gap-6 md:grid-cols-5">
          <div className="col-span-1 hidden text-center md:block"></div>
          <div className="relative col-span-4 mb-12">
            <div className="absolute z-20 flex h-full w-full flex-col items-center justify-center">
              <h2 className="mb-6 text-xl font-semibold md:-mt-24 md:text-3xl">
                Unlock your profile, it’s free 😏
              </h2>
              <Button href="/login">
                Sign up with GitHub
                <FaGithub className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="blur-lg">
              <h3 className="mb-2 mt-12 text-xl font-medium">Contributions @ Formbricks</h3>
              {dummyIssues.map((issue) => (
                <GitHubIssue issue={issue} key={issue.title} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
