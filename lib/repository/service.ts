import { db } from "@/lib/db";
import { TRepository } from "@/types/repository";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { repositoryCache } from "./cache";

/**
 * Fetches all repositories from the database.
 * @returns An array of repositories.
 */
export const getAllRepositories = async () => {
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

export const getRepositoryByGithubId = (githubId: number): Promise<TRepository | null> =>
  unstable_cache(
    async () => {
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
    },
    [`getRepositoryByGithubId-${githubId}`],
    {
      tags: [repositoryCache.tag.byGithubId(githubId)],
      revalidate: 60 * 20,
    }
  )();

/**
 * Fetches one repositories from the database by id.
 * @returns A repository.
 */

export const getRepositoryById = (id: string) =>
  unstable_cache(
    async () => {
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
    },
    [`getRepositoryById-${id}`],
    {
      tags: [repositoryCache.tag.byId(id)],
      revalidate: 60 * 20, // Cache for 20 minutes
    }
  )();

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
  repositoryCache.revalidate({ id });

  return updatedRepository;
};

/**
 * Fetches a repository
 * @returns The fetched repository.
 */

export const fetchRepoDetails = (id: string) =>
  unstable_cache(
    async () => {
      try {
        return await db.repository.findUnique({
          where: { id },
        });
      } catch (error) {
        throw new Error(`Failed to fetch repository details: ${error}`);
      }
    },
    [`fetchRepoDetails-${id}`],
    {
      tags: [repositoryCache.tag.byId(id)],
      revalidate: 60 * 20, // Cache for 20 minutes
    }
  )();

/**
 * Fetches all repository a user has membership for
 * @returns An array of repositories.
 */
export const getRepositoriesForUser = (userId: string) =>
  unstable_cache(
    async (): Promise<TRepository[]> => {
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

        return userRepositories as TRepository[];
      } catch (error) {
        console.error(`Failed to get repositories for user: ${error}`);
        throw new Error("Failed to retrieve user repositories");
      }
    },
    [`getRepositoriesForUser-${userId}`],
    {
      tags: [repositoryCache.tag.byUserId(userId)],
      revalidate: 60 * 20, // Cache for 20 minutes
    }
  )();
