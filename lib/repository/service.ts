import { db } from "@/lib/db";
import { TRepository } from "@/types/repository";
import { Prisma } from "@prisma/client";

/**
 * Fetches all repositories from the database.
 * @returns An array of repositories.
 */
export const getAllRepositories = async (): Promise<TRepository[]> => {
  try {
    const repositories = await db.repository.findMany();
    return repositories as TRepository[];
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("An error occurred while fetching repositories:", error.message);
      throw new Error("Database error occurred");
    }
    throw error;
  }
};
