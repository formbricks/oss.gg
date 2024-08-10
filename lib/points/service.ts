import { db } from "@/lib/db";
import { ZId, ZOptionalNumber } from "@/types/common";
import { DatabaseError } from "@/types/errors";
import { TPointTransactionWithUser } from "@/types/pointTransaction";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { DEFAULT_CACHE_REVALIDATION_INTERVAL, ITEMS_PER_PAGE } from "../constants";
import { validateInputs } from "../utils/validate";
import { pointsCache } from "./cache";

export const assignUserPoints = async (
  userId: string,
  points: number,
  description: string,
  url: string,
  repositoryId: string
) => {
  try {
    const alreadyAssignedPoints = await db.pointTransaction.findFirst({
      where: {
        userId,
        repositoryId,
        url,
      },
    });
    if (alreadyAssignedPoints) {
      throw new Error("Points already assigned for this user for the given url");
    }

    const pointsUpdated = await db.pointTransaction.create({
      data: {
        points,
        userId,
        description,
        url,
        repositoryId,
      },
    });
    return pointsUpdated;
  } catch (error) {
    throw error;
  }
};

export const getPointsOfUsersInRepoByRepositoryId = async (
  repositoryId: string,
  page?: number
): Promise<TPointTransactionWithUser[]> => {
  const points = await unstable_cache(
    async () => {
      validateInputs([repositoryId, ZId], [page, ZOptionalNumber]);
      try {
        //currently prisma doesn't support using "include" inside of "GroupBy",thus a raw query. Change it when prisma starts supporting "include" inside of "GroupBy".
        const points = (await db.$queryRaw`
        SELECT
          pt."userId",
          u.name,
          u."avatarUrl",
          u.login,
          SUM(pt.points)::int AS points
        FROM 
          point_transactions pt 
        JOIN 
          users u ON pt."userId" = u.id 
        WHERE 
          pt."repositoryId" = ${repositoryId}
        GROUP BY
          pt."userId",
          u.name,
          u."avatarUrl",
          u.login
        ORDER BY 
          points DESC
        LIMIT ${page ? ITEMS_PER_PAGE : 0}
        OFFSET ${page ? ITEMS_PER_PAGE * (page - 1) : 0}
      `) as TPointTransactionWithUser[];

        return points;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }
        throw error;
      }
    },

    [`getPointsOfUsersInRepoByRepositoryId-${repositoryId}-${page}`],
    {
      tags: [pointsCache.tag.byRepositoryId(repositoryId)],
      revalidate: DEFAULT_CACHE_REVALIDATION_INTERVAL,
    }
  )();
  return points;
};

export const getPointsForPlayerInRepoByRepositoryId = async (
  playerRepositoryId: string,
  playerId: string
): Promise<number> => {
  try {
    const playerPoints = await db.pointTransaction.aggregate({
      where: {
        repositoryId: playerRepositoryId,
        userId: playerId,
      },
      _sum: {
        points: true,
      },
    });

    return playerPoints?._sum.points ?? 0;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};
