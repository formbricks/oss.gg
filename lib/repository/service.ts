import { db } from "@/lib/db";
import { TRepository } from "@/types/repository";
import { Prisma } from "@prisma/client";

/**
 * Fetches all repositories from the database.
 * @returns An array of repositories.
 */
export const getAllRepositories = async (): Promise<TRepository[]> => {
  try {
    const repositories = await db.repository.findMany({
      where: {
        configured: true,
      },
    });
    return repositories as TRepository[];
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("An error occurred while fetching repositories:", error.message);
      throw new Error("Database error occurred");
    }
    throw error;
  }
};

/**
 * Fetches one repositories from the database by GitHub Id.
 * @returns A repository.
 */

export const getRepositoryByGithubId = async (githubId: number) => {
  try {
    const repository = await db.repository.findFirst({
      where: {
        githubId,
      },
      include: {
        installation: {
          include: {
            memberships: true,
          },
        },
      },
    });
    return repository;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("An error occurred while fetching repository:", error.message);
      throw new Error("Database error occurred");
    }
    throw error;
  }
};

/**
 * Fetches one repositories from the database by id.
 * @returns A repository.
 */

export const getRepositoryById = async (id: string) => {
  try {
    const repository = await db.repository.findFirst({
      where: {
        id,
      },
      include: {
        installation: {
          include: {
            memberships: true,
          },
        },
      },
    });
    return repository;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("An error occurred while fetching repository:", error.message);
      throw new Error("Database error occurred");
    }
    throw error;
  }
};

/**
 * Updates a repository's configuered state
 * @returns The updated repository.
 */

export const updateRepository = async (id: string, configuredValue: boolean) => {
  const updatedRepository = await db.repository.update({
    where: { id },
    data: { configured: configuredValue },
  });

  if (!updatedRepository) {
    throw new Error("Repository not found.");
  }

  return updatedRepository;
};

/**
 * Fetches a repository
 * @returns The fetched repository.
 */

export const fetchRepoDetails = async (id: string) => {
  try {
    return await db.repository.findUnique({
      where: { id },
    });
  } catch (error) {
    throw new Error(`Failed to fetch repository details: ${error}`);
  }
};

/**
 * Fetches all repository a user has membership for
 * @returns An array of repositories.
 */
export const getRepositoriesForUser = async (userId: string) => {
  try {
    const userRepositories = await db.repository.findMany({
      where: {
        installation: {
          memberships: {
            some: {
              userId,
            },
          },
        },
      },
    });

    return userRepositories;
  } catch (error) {
    throw new Error(`Failed to get repositories for user: ${error}`);
  }
};
