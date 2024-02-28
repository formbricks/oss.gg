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
