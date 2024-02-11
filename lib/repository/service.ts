import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * Fetches all repositories from the database.
 * @returns An array of repositories.
 */
export const getAllRepositories = async () => {
  try {
    const repositories = await db.repository.findMany();
    return repositories;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("An error occurred while fetching repositories:", error.message);
      throw new Error("Database error occurred");
    }
    throw error;
  }
};
