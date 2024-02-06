import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Open issues",
  description: "Comment on these issues to get assigned to work on them.",
}

const dummyIssues = [
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    title: "[FEATURE] Share survey results publicly",
    author: "jobenjada",
    points: "500",
    key: "0",
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: "500",
    key: "1",
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: "500",
    key: "2",
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: "500",
    key: "3",
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    title: "[FEATURE] Share survey results publicly",
    href: "https://github.com/formbricks/formbricks/issues/1916",
    author: "jobenjada",
    points: "500",
    key: "4",
  },
]

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Open issues"
        text="Comment on these issues to get assigned to work on them."
      />
      <div className="space-y-2">
        {dummyIssues ? (
          dummyIssues.map((issue) => (
            <Link
              href={issue.href}
              target="_blank"
              key={issue.key}
              className="bg-slate-50 rounded-md p-3 flex space-x-3 items-center hover:bg-slate-100 hover:scale-102 border border-transparent hover:border-slate-200 transition-all hover:cursor-pointer ease-in-out duration-150"
            >
              <Image
                className="rounded-md"
                src={issue.logoHref}
                alt={issue.title}
                width={50}
                height={50}
              />
              <div>
                <p className="font-medium">{issue.title}</p>
                <p className="text-xs mt-0.5">opened by {issue.author}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-slate-50 rounded-md h-96 flex flex-col items-center justify-center space-y-4">
            <p>You have not yet enrolled to play in a repository 🕹️</p>
            <Button href="/enroll">Explore oss.gg repositories</Button>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
