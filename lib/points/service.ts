import { db } from "@/lib/db";
import { ZId, ZOptionalNumber } from "@/types/common";
import { DatabaseError } from "@/types/errors";
import { TPointTransactionWithUser, ZPointTransaction } from "@/types/pointTransaction";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { DEFAULT_CACHE_REVALIDATION_INTERVAL, ITEMS_PER_PAGE } from "../constants";
import { formatDateFields } from "../utils/datetime";
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

export const totalRepoPoints = async (userId: string, repositoryId: string) => {

  try {
    const totalPoints = await db.pointTransaction.aggregate({
      _sum: {
        points: true,
      },
      where: {
        userId,
        repositoryId,
      },
    });
    if (!totalPoints._sum.points) {
      return 0;
    }
    return totalPoints._sum.points;
  } catch (error) {
    throw error;
  }
  
}

export const getPointsOfUsersInRepoByRepositoryId = async (
  repositoryId: string,
  page?: number
): Promise<TPointTransactionWithUser[]> => {
  const points = await unstable_cache(
    async () => {
      validateInputs([repositoryId, ZId], [page, ZOptionalNumber]);
      try {
        const points = await db.pointTransaction.findMany({
          where: {
            repositoryId: repositoryId,
          },

          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
          orderBy: {
            points: "desc",
          },
          include: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
                login: true,
              },
            },
          },
        });
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
  return points.map((point: TPointTransactionWithUser) => {
    return {
      ...formatDateFields(point, ZPointTransaction),
      user: point.user,
    };
  });
};
