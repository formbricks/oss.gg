import Link from "next/link";

export default async function IssuesPage() {
  /*   const ossGgRepositories = await getAllRepositories();
  const pullRequests: TPullRequest[] = await getAllOssGgIssuesOfRepos(
    ossGgRepositories.map((repo) => ({ id: repo.githubId, fullName: `${repo.owner}/${repo.name}` }))
  ); */

  const issueLists = [
    {
      repo: "dub",
      href: "https://github.com/dubinc/dub/issues?q=is:open+is:issue+label:%22%F0%9F%95%B9%EF%B8%8F+oss.gg%22",
    },
    {
      repo: "formbricks",
      href: "https://github.com/formbricks/formbricks/issues?q=is:open+is:issue+label:%22%F0%9F%95%B9%EF%B8%8F+oss.gg%22",
    },
    {
      repo: "hanko",
      href: "https://github.com/teamhanko/hanko/issues?q=is:open+is:issue+label:%22%F0%9F%95%B9%EF%B8%8F+oss.gg%22",
    },
    {
      repo: "openbb",
      href: "https://github.com/OpenBB-finance/OpenBB/issues?q=is:open+is:issue+label:%22%F0%9F%95%B9%EF%B8%8F+oss.gg%22",
    },
    {
      repo: "papermark",
      href: "https://github.com/mfts/papermark/issues?q=is:open+is:issue+label:%22%F0%9F%95%B9%EF%B8%8F+oss.gg%22",
    },
    {
      repo: "twenty",
      href: "https://github.com/twentyhq/twenty/issues?q=is:open+is:issue+label:%22%F0%9F%95%B9%EF%B8%8F+oss.gg%22",
    },
    {
      repo: "unkey",
      href: "https://github.com/unkeyed/unkey/issues?q=is:open+is:issue+label:%22%F0%9F%95%B9%EF%B8%8F+oss.gg%22",
    },
  ];

  return (
    <div className="space-y-2 font-mono text-xs">
      <h1 className="pb-2 font-bold">available issues</h1>
      <ul className="list-none space-y-2">
        {issueLists.map((pullRequest) => (
          <li key={pullRequest.href}>
            <Link href={pullRequest.href} className="underline-offset-4 hover:underline" target="_blank">
              <span>{pullRequest.repo}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
