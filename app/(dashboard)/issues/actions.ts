"use server";

import { getEnrolledRepositories } from "@/lib/enrollment/service";
import { getCurrentUser } from "@/lib/session";
import { TRepository } from "@/types/repository";

/**
 * Checks if the authenticated user is already enrolled in a specific repository.
 * @returns An array of repos the signed in user is enrolled to.
 */
export const getEnrolledRepositoriesAction = async (): Promise<TRepository[]> => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("User must be authenticated to perform this action.");
    }

    return await getEnrolledRepositories(user.id);
  } catch (error) {
    console.error("Error checking enrollment:", error.message);
    throw new Error("Failed to check enrollment.");
  }
};
