"use server";

import { getPointsOfUsersInRepoByRepositoryId } from "@/lib/points/service";
import { getCurrentUser } from "@/lib/session";
import { TPointTransactionWithUser } from "@/types/pointTransaction";

export const getPointsOfUsersInRepoByRepositoryIdAction = async (
  repositoryId: string,
  page: number
): Promise<TPointTransactionWithUser[]> => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("User must be authenticated to perform this action.");
    }
    return await getPointsOfUsersInRepoByRepositoryId(repositoryId, page);
  } catch (error) {
    console.error("Error getting users and their points:", error.message);
    throw new Error("Error getting users and their points.");
  }
};
