import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import PointsCard from "@/components/ui/pointsCard";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "oss.gg",
  description: "Gamify open source contributions. Less work, more fun!",
};

const cards = [
  {
    href: "/enroll",
    title: "Find projects",
    description: "Enroll to play. Ship code or complete non-code tasks to gather points and level up.",
  },
  {
    href: "/issues",
    title: "Explore open issues",
    description: "Already enrolled? Explore open issues or non-code tasks specific to each OS project.",
  },
  {
    href: "/contribute",
    title: "Help build oss.gg",
    description:
      "oss.gg is a community project! We're all building this together. Join our Discord to help deliver it.",
  },
  {
    href: "/",
    title: "What is oss.gg?",
    description: "Find out why we're building this - and how you can become a part of it!",
  },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Shall we play a game?"></DashboardHeader>
      <PointsCard repositoryName="Formbricks" points={480} rank={100} />
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            href={card.href}
            key={card.href}
            className="flex items-center space-x-3 rounded-md border border-transparent bg-muted p-6 transition-all duration-150 ease-in-out hover:scale-102 hover:cursor-pointer ">
            <div>
              <p className="mt-12 text-xl font-medium">{card.title}</p>
              <p className="mt-0.5 text-xs">opened by {card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
