"use server";

import { createLevel, deleteLevel, updateLevel, updateLevelIcon } from "@/lib/levels/service";
import { getCurrentUser } from "@/lib/session";
import { TLevelInput } from "@/types/level";

export async function createLevelAction(levelData: TLevelInput) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return { error: "User must be authenticated to perform this action." };
  }
  await createLevel(levelData);
}

//TODO: fix the type
export async function updateLevelIconAction(updateData: {
  name: string;
  repositoryId: string;
  iconUrl: string;
}) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return { error: "User must be authenticated to perform this action." };
  }
  // update level icon

  await updateLevelIcon(updateData.name, updateData.repositoryId, updateData.iconUrl);
}


export async function deleteLevelAction(levelData: {
  repositoryId: string;
  name: string;
}) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return { error: "User must be authenticated to perform this action." };
  }
  await deleteLevel(levelData.name, levelData.repositoryId);
}