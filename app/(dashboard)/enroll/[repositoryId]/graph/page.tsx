import { ContributorAvatar } from "./ContributorAvatar";
import {db} from "@/lib/db";

export const dynamic = "force-dynamic";

interface Contributor {
  avatarUrl: string;
  name: string;
  points: number;
  githubId: string;
}

interface Position {
  x: number;
  y: number;
  size: number;
}

async function getData(repositoryId: string) {
  const pointTransactions = await db.pointTransaction.groupBy({
    by: ['userId'],
    where: {
      repositoryId,
    },
    _sum: {
      points: true,
    },
  });

  const users = await db.user.findMany({
    where: {
      id: {
        in: pointTransactions.map((entry) => entry.userId),
      },
    },
    select: {
      avatarUrl: true,
      name: true,
      githubId: true,
    },
  });

  return users.map((user) => ({
    avatarUrl: user.avatarUrl || '',
    name: user.name || '',
    points: pointTransactions.find((entry) => entry.userId === user.id)?._sum.points || 0,
    githubId: user.githubId.toString(),
  })).filter((c) => c.avatarUrl && c.name && c.points > 0);
}

export default async function Component() {
  const contributors = await getData();

  // Move these calculations to server
  const maxPoints = Math.max(...contributors.map((c) => c.points));

  const minSize = 40;
  const maxSize = 180;

  const checkCollision = (positions: Position[], newPos: Position): boolean => {
    for (const pos of positions) {
      const dx = newPos.x - pos.x;
      const dy = newPos.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < (newPos.size + pos.size) / 2) {
        return true;
      }
    }
    return false;
  };

  const generatePositions = (contributors: Contributor[]): Position[] => {
    const positions: Position[] = [];
    const containerWidth = 1600;
    const containerHeight = 900;
    const maxAttempts = 100;

    for (const contributor of contributors) {
      const size =
        minSize +
        Math.sqrt(contributor.points / maxPoints) * (maxSize - minSize);
      let newPos: Position | null = null;
      let attempts = 0;

      while (!newPos && attempts < maxAttempts) {
        const x = Math.random() * (containerWidth - size);
        const y = Math.random() * (containerHeight - size);
        const testPos = { x, y, size };

        if (!checkCollision(positions, testPos)) {
          newPos = testPos;
        }

        attempts++;
      }

      if (newPos) {
        positions.push(newPos);
      }
    }

    return positions;
  };

  const positions = generatePositions(contributors);

  return (
    <div className="w-dvh max-w-screen h-dvh max-h-screen min-h-[900px] min-w-[1600px] bg-gradient-to-br from-white to-[#fb7a00]">
      <div className="relative flex items-center justify-center">
        {contributors.map((contributor, index) => {
          const position = positions[index];
          if (!position) return null;

          return (
            <ContributorAvatar
              key={`${contributor.name}-${index}`}
              contributor={contributor}
              position={position}
            />
          );
        })}
      </div>
    </div>
  );
}