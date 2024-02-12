"use server";

import { createEnrollment, deleteEnrollment, hasEnrollmentForRepository } from "@/lib/enrollment/service";
import { getCurrentUser } from "@/lib/session";

/**
 * Creates an enrollment for the authenticated user in a specific repository.
 * @param repositoryId - The data needed to create the enrollment, excluding the userId.
 * @returns The created enrollment object.
 */
export const enrollCurrentUserAction = async (repositoryId: string) => {
  console.log("createEnrollmentAction: Start", { repositoryId });

  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      throw new Error("User must be authenticated to perform this action.");
    }

    const fullEnrollmentData = { repositoryId: repositoryId, userId: user.id };

    const enrollment = await createEnrollment(fullEnrollmentData);
    return enrollment;
  } catch (error) {
    throw new Error(`Failed to create enrollment: ${error}`);
  }
};


/**
 * Deletes an existing enrollment for the authenticated user in a specific repository.
 * @param repositoryId - The ID of the repository from which the user is to be unenrolled.
 */
export const disenrollCurrentUserAction = async (repositoryId: string): Promise<void> => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("User must be authenticated to perform this action.");
    }
    
    await deleteEnrollment(user.id, repositoryId);
  } catch (error) {
    console.error("Error deleting enrollment:", error.message);
    throw new Error("Failed to delete enrollment.");
  }
};

/**
 * Checks if the authenticated user is already enrolled in a specific repository.
 * @param repositoryId - The ID of the repository to check enrollment against.
 * @returns A boolean indicating whether the user is enrolled.
 */
export const hasEnrollmentForRepositoryAction = async (repositoryId: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      throw new Error("User must be authenticated to perform this action.");
    }
    
    return await hasEnrollmentForRepository(user.id, repositoryId);
  } catch (error) {
    console.error("Error checking enrollment:", error.message);
    throw new Error("Failed to check enrollment.");
  }
};