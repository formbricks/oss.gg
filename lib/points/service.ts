import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

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
