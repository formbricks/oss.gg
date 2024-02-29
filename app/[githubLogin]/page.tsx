import { Button } from "@/components/ui/button";
import GitHubIssue from "@/components/ui/githubIssue";
import { getEnrolledRepositories } from "@/lib/enrollment/service";
import { getMergedPullRequestsByGithubLogin, getOpenPullRequestsByGithubLogin } from "@/lib/github/service";
import { getGithubUserByLogin } from "@/lib/githubUser/service";
import { getUserByLogin } from "@/lib/user/service";
import Rick from "@/public/rick.webp";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

export const metadata = {
  title: "oss.gg Profile",
};

const dummyIssues = [
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    title: "[FEATURE] Share survey results publicly",
    author: "jobenjada",
    points: 500,
    key: "0",
    isIssue: true,
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: 500,
    key: "1",
    isIssue: true,
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: 250,
    key: "2",
    isIssue: true,
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: 300,
    key: "3",
    isIssue: true,
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: 400,
    key: "4",
    isIssue: true,
  },
];

const ProfileInfo = ({ githubUserData }) => (
  <div className="z-40 -mt-24 grid grid-cols-5 gap-6 text-slate-50 md:-mt-36">
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
    const [githubUserData, mergedIssues, openPRs] = await Promise.all([
      getGithubUserByLogin(githubLogin).then(
        (data) => data || { name: "Unknown", avatar_url: Rick, bio: "No bio available" }
      ),
      getMergedPullRequestsByGithubLogin("formbricks/formbricks", githubLogin),
      getOpenPullRequestsByGithubLogin("formbricks/formbricks", githubLogin),
    ]);

    const userEnrollments = await getEnrolledRepositories(user?.id);

    return (
      <div>
        <ProfileInfo githubUserData={githubUserData} />
        <div className="mt-12 grid grid-cols-4 gap-6 md:grid-cols-5">
          <div className="col-span-1 hidden text-center md:block">
            {/* <h2 className="text-7xl text-gray-800">#3</h2> <p className="text-sm text-gray-500">of 727</p> */}
          </div>
          <div className="col-span-4 space-y-12">
            <div>
              {openPRs.length > 1 && (
                <div>
                  <h3 className="mb-2 text-xl font-medium">
                    Open PRs @ Formbricks by {githubUserData.name}{" "}
                  </h3>
                  {openPRs.map((pr) => (
                    <GitHubIssue issue={pr} key={pr.title} />
                  ))}
                </div>
              )}
            </div>
            <div>
              {userEnrollments.some((item) => item.name === "formbricks") && (
                <>
                  <h3 className="mb-2 text-xl font-medium">Congrats! </h3>
                  <div className="flex items-center space-x-3 rounded-lg border border-muted p-3">
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-2 text-3xl">🎉</div>
                    <div>
                      <p className="font-medium">
                        {githubUserData?.name} enrolled to contribute to Formbricks
                      </p>
                      <p className="mt-0.5 text-xs">Let the games begin!</p>
                    </div>
                  </div>
                </>
              )}
            </div>
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
                <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-md bg-slate-50">
                  <p>You have not yet contributed to an oss.gg repository 🕹️</p>
                  <Button href="/enroll">Get started!</Button>
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
