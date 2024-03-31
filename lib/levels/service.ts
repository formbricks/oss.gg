import { db } from "@/lib/db";
import { TLevelInput } from "@/types/level";
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

export const createLevel = async (LevelData: TLevelInput) => {
  //TODO: this should create and update
  try {
    await db.level.create({
      data: {
        description: LevelData.description,
        name: LevelData.name,
        pointThreshold: LevelData.pointThreshold,
        icon: LevelData.icon,
        repositoryId: LevelData.repositoryId,
        permissions: LevelData.permissions,
        tags: LevelData.tags,
      },
    });
  } catch (error) {
    console.log("this was the error faced while creating a level : ", error);
    throw error;
  }
};

export const updateLevel = async (LevelData: TLevelInput) => {
  try {
    await db.level.update({
      where: {
        repositoryId: LevelData.repositoryId,
        name: LevelData.name,
      },
      data: {
        description: LevelData.description,
        pointThreshold: LevelData.pointThreshold,
        icon: LevelData.icon,
        permissions: LevelData.permissions,
        name: LevelData.name,
        tags: LevelData.tags,
      },
    });
  } catch (error) {
    throw error;
  }
};

//TODO: type this better
export const updateLevelIcon = async (name: string, repositoryId: string, iconUrl: string) => {
  try {
    await db.level.update({
      where: {
        repositoryId,
        name,
      },
      data: {
        icon: iconUrl,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteLevel = async (name: string, repositoryId: string ) => {
  try {
    await db.level.delete({
      where: {
        repositoryId: repositoryId,
        name: name,
      },
    });
  } catch (error) {
    throw error;
  }
};
