import { db } from "@/lib/db";
import { ZId, ZString } from "@/types/common";
import { TLevel, ZLevel } from "@/types/level";
import { unstable_cache } from "next/cache";

import { DEFAULT_CACHE_REVALIDATION_INTERVAL } from "../constants";
import { validateInputs } from "../utils/validate";
import { levelsCache } from "./cache";

export const createLevel = async (levelData: TLevel): Promise<TLevel[]> => {
  validateInputs([levelData, ZLevel]);
  try {
    const repository = await db.repository.findUnique({
      where: {
        id: levelData.repositoryId,
      },
      select: { levels: true },
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    const existingLevels = (repository.levels || []) as TLevel[];

    existingLevels.push(levelData);

    const updatedRepositoryWithNewLevel = await db.repository.update({
      where: {
        id: levelData.repositoryId,
      },
      data: {
        levels: existingLevels,
      },
    });

    levelsCache.revalidate({
      repositoryId: updatedRepositoryWithNewLevel.id,
    });

    return updatedRepositoryWithNewLevel.levels as TLevel[];
  } catch (error) {
    throw error;
  }
};

export const updateLevel = async (levelData: TLevel): Promise<TLevel[]> => {
  validateInputs([levelData, ZLevel]);
  try {
    const repository = await db.repository.findUnique({
      where: {
        id: levelData.repositoryId,
      },
      select: {
        levels: true,
      },
    });

    if (!repository) {
      throw new Error("Repository not found");
    }
    const levels = repository.levels as TLevel[];
    const existingLevelIndex = levels.findIndex((level: TLevel) => level.id === levelData.id);

    if (existingLevelIndex === -1) {
      throw new Error("Level not found in repository");
    }

    const updatedLevels = [...levels];
    updatedLevels[existingLevelIndex] = levelData;

    const updatedRepositoryWithUpdatedLevel = await db.repository.update({
      where: {
        id: levelData.repositoryId,
      },
      data: {
        levels: updatedLevels,
      },
    });
    levelsCache.revalidate({
      repositoryId: updatedRepositoryWithUpdatedLevel.id,
    });
    return updatedRepositoryWithUpdatedLevel.levels as TLevel[];
  } catch (error) {
    throw error;
  }
};

export const deleteLevel = async (repositoryId: string, levelId: string): Promise<TLevel> => {
  validateInputs([levelId, ZString], [repositoryId, ZId]);
  try {
    const repository = await db.repository.findUnique({
      where: {
        id: repositoryId,
      },
      select: { levels: true },
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    const existingLevels = repository.levels as TLevel[];

    const levelIndex = existingLevels.findIndex((level) => level.id === levelId);

    if (levelIndex === -1) {
      throw new Error("Level not found in repository");
    }

    const deletedLevel = existingLevels[levelIndex];

    existingLevels.splice(levelIndex, 1);

    const updatedRepositoryWithUpdatedLevels = await db.repository.update({
      where: {
        id: repositoryId,
      },
      data: {
        levels: existingLevels,
      },
    });

    levelsCache.revalidate({
      repositoryId: updatedRepositoryWithUpdatedLevels.id,
    });

    return deletedLevel;
  } catch (error) {
    throw error;
  }
};

export const getLevels = async (repositoryId: string): Promise<TLevel[]> => {
  const levels = await unstable_cache(
    async () => {
      validateInputs([repositoryId, ZId]);

      try {
        const repository = await db.repository.findUnique({
          where: {
            id: repositoryId,
          },
          select: { levels: true },
        });

        if (!repository) {
          throw new Error("Repository not found");
        }
        return repository.levels as TLevel[];
      } catch (error) {
        throw error;
      }
    },
    [`getLevels-${repositoryId}`],
    {
      tags: [levelsCache.tag.byRepositoryId(repositoryId)],
      revalidate: DEFAULT_CACHE_REVALIDATION_INTERVAL,
    }
  )();
  return levels;
};
