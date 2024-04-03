import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import PointsCard from "@/components/ui/pointsCard";
import { authOptions } from "@/lib/auth";
import { getEnrolledRepositories } from "@/lib/enrollment/service";
import { getCurrentUser } from "@/lib/session";
import { TPointTransaction } from "@/types/pointTransaction";
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

  const repositoriesUserIsEnrolledIn = await getEnrolledRepositories(user.id);

  const calculateRankOfCurrentUser = (userId: string, pointTransactions: TPointTransaction[]) => {
    // Create an object to store the total points for each user enrolled in the repositories that the current user is in.
    const totalPointsOfAllUsersInTheRepo = {};

    // Calculate total points for each user in the repositories that current user is enrolled in.
    pointTransactions.forEach((pointTransaction) => {
      const userId = pointTransaction.userId;
      const points = pointTransaction.points;

      if (!totalPointsOfAllUsersInTheRepo[userId]) {
        totalPointsOfAllUsersInTheRepo[userId] = points;
      } else {
        totalPointsOfAllUsersInTheRepo[userId] += points;
      }
    });

    // Convert the totalPointsOfAllUsersInTheRepo object into an array for sorting.
    const usersPointsArray: [string, number][] = Object.entries(totalPointsOfAllUsersInTheRepo);

    // Sort the userPointsArray array in descending order based on points.
    const sortedUserPoints = usersPointsArray.sort((a, b) => b[1] - a[1]);

    // Find the index of the current user's entry in the sorted array. user[0] is userId.
    const userIndex = sortedUserPoints.findIndex((user) => user[0] === userId);

    const userRank = userIndex !== -1 ? userIndex + 1 : null;

    return userRank;
  };

  // Calculate total points and rank for the current user in repositories they are enrolled in.
  const pointsPerRepository = repositoriesUserIsEnrolledIn.map((repository) => {
    const totalPoints =
      repository.pointTransactions &&
      repository.pointTransactions.reduce((acc, transaction) => {
        if (transaction.userId === user.id) {
          return acc + transaction.points;
        }
        return acc;
      }, 0);
    const rank = calculateRankOfCurrentUser(user.id, repository.pointTransactions as TPointTransaction[]);

    return {
      id: repository.id,
      repositoryName: repository.name,
      points: totalPoints,
      repositoryLogo: repository.logoUrl,
      rank: rank,
    };
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Shall we play a game?"></DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {pointsPerRepository.map((point) => {
          return (
            <PointsCard
              key={point.id}
              repositoryName={point.repositoryName}
              points={point.points || 0}
              rank={point.rank || 0}
              repositoryLogo={point.repositoryLogo || ""}
            />
          );
        })}
      </div>
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
