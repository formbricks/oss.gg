import { db } from "@/lib/db";
import { TEnrollment, TEnrollmentInput, ZEnrollmentInput } from "@/types/enrollment";
import { DatabaseError } from "@/types/errors";
import { TRepository } from "@/types/repository";
import { Prisma } from "@prisma/client";

import { getRepositoryById } from "../repository/service";
import { getUser } from "../user/service";
import { validateInputs } from "../utils/validate";

/**
 * Creates an enrollment for a user in a repository.
 * @param enrollmentData - The data needed to create the enrollment.
 * @returns The created enrollment.
 */

export const createEnrollment = async (enrollmentData: TEnrollmentInput): Promise<TEnrollment> => {
  validateInputs([enrollmentData, ZEnrollmentInput]);

  try {
    // Check if enrollment already exists
    const existingEnrollment = await db.enrollment.findFirst({
      where: {
        userId: enrollmentData.userId,
        repositoryId: enrollmentData.repositoryId,
      },
    });

    console.log("existing enrollment", existingEnrollment);

    if (existingEnrollment) {
      throw new Error("Enrollment already exists.");
    }

    console.log("creating new enrollment");

    const enrollment = await db.enrollment.create({
      data: enrollmentData,
    });

    const user = await getUser(enrollmentData.userId);
    console.log("user", user);

    const repository = await getRepositoryById(enrollmentData.repositoryId);
    console.log("repository", repository);

    console.log("new enrollment created", enrollment);

    return enrollment;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
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

/**
 * Retrieves an array of repositories that a user is enrolled in.
 * @param userId - The ID of the user for whom enrolled repositories are being queried.
 * @returns A Promise that resolves to an array of TRepository objects, each representing
 * a repository the user is enrolled in. The array is empty if the user has no enrollments.
 */

export const getEnrolledRepositories = async (userId: string): Promise<TRepository[]> => {
  const enrolledRepositories = await db.repository.findMany({
    where: {
      Enrollment: {
        some: {
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      githubId: true,
      name: true,
      description: true,
      homepage: true,
      configured: true,
      topics: true,
      installation: true,
      installationId: true,
      pointTransactions: true,
      Enrollment: true,
    },
  });

  return enrolledRepositories;
};
