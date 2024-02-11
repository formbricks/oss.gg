import { db } from "@/lib/db";
import { TEnrollment, TEnrollmentInput, ZEnrollmentInput } from "@/types/enrollment";
import { DatabaseError } from "@/types/errors";
import { Prisma } from "@prisma/client";
import { validateInputs } from "../utils/validate";

/**
 * Creates an enrollment for a user in a repository.
 * @param enrollmentData - The data needed to create the enrollment.
 * @returns The created enrollment.
 */

export const createEnrollment = async (enrollmentData: TEnrollmentInput): Promise<TEnrollment> => {
  console.log("createEnrollment: Start", { enrollmentData });

  validateInputs([enrollmentData, ZEnrollmentInput]);

  try {
    const enrollment = await db.enrollment.create({
      data: enrollmentData,
    });
    console.log("createEnrollment: Success", { enrollment });
    return enrollment;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("createEnrollment: Prisma Error", error.message, { error });
      throw new DatabaseError(error.message);
    }
    console.error("createEnrollment: Error", error.message, { error });
    throw error;
  }
};


/**
 * Deletes an enrollment for a user in a repository.
 * @param userId - The ID of the user.
 * @param repositoryId - The ID of the repository.
 * @returns The result of the delete operation.
 */

export const deleteEnrollment = async (userId: string, repositoryId: string): Promise<void> => {
  try {
    await db.enrollment.delete({
      where: {
        userId_repositoryId: {
          userId,
          repositoryId,
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

/**
 * Checks if a user is already enrolled in a repository.
 * @param userId - The ID of the user.
 * @param repositoryId - The ID of the repository.
 * @returns A boolean indicating whether the user is enrolled.
 */

export const hasEnrollmentForRepository = async (userId: string, repositoryId: string): Promise<boolean> => {
  const count = await db.enrollment.count({
    where: {
      userId,
      repositoryId,
    },
  });
  return count > 0;
};

