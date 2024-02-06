import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "oss.gg",
  description: "Gamify open source contributions. Less work, more fun!",
}

const cards = [
  {
    href: "/enroll",
    title: "Find projects",
    description:
      "Enroll to play. Ship code or complete non-code tasks to gather points and level up.",
  },
  {
    href: "/issues",
    title: "Explore open issues",
    description:
      "Already enrolled? Explore open issues or non-code tasks specific to each OS project.",
  },
  {
    href: "/settings",
    title: "Settings",
    description:
      "Add your address to receive merch and change notification settings.",
  },
  {
    href: "/",
    title: "Your profile",
    description:
      "oss.gg provides you with a profile page to show case your contributions. Attach it to your CV!",
  },
  {
    href: "/contribute",
    title: "Help build oss.gg",
    description:
      "oss.gg is a community project! We’re all building this together. Join our Discord to help deliver it.",
  },
  {
    href: "/",
    title: "What is oss.gg?",
    description:
      "Find out why we’re building this - and how you can become a part of it!",
  },
]

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Shall we play a game?"></DashboardHeader>
      <div className="gap-4 grid md:grid-cols-2">
        {cards.map((card) => (
          <Link
            href={card.href}
            key={card.href}
            className="bg-slate-50 rounded-md p-6 flex space-x-3 items-center hover:bg-slate-100 hover:scale-102 border border-transparent hover:border-slate-200 transition-all hover:cursor-pointer ease-in-out duration-150"
          >
            <div>
              <p className="font-medium mt-12 text-xl">{card.title}</p>
              <p className="text-xs mt-0.5">opened by {card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardShell>
  )
}
