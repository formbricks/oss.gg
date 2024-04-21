"use server";

import { createLevel, deleteLevel, updateLevel } from "@/lib/levels/service";
import { getCurrentUser } from "@/lib/session";
import { TLevel } from "@/types/level";

export const createLevelAction = async (levelData: TLevel) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("User must be authenticated to perform this action.");
    }
    return await createLevel(levelData);
  } catch (error) {
    throw new Error(`Failed to create level.`);
  }
};

export const updateLevelAction = async (updateData: TLevel) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("User must be authenticated to perform this action.");
    }

    return await updateLevel(updateData);
  } catch (error) {
    throw new Error(`Failed to update level.`);
  }
};

export const deleteLevelAction = async (repositoryId: string, levelId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("User must be authenticated to perform this action.");
    }
    return await deleteLevel(repositoryId, levelId);
  } catch (error) {
    throw new Error(`Failed to delete level.`);
  }
};
