"use server";

import { getAllRepositories } from "@/lib/repository/service";
import { getCurrentUser } from "@/lib/session";
import { TRepository } from "@/types/repository";

export const getAllRepositoriesAction = async (): Promise<{ error: string } | TRepository[]> => {
  console.log("Starting getAllRepositoriesAction...");

  try {
    console.log("Attempting to get current user...");
    const user = await getCurrentUser();
    console.log(`Current user: ${user ? JSON.stringify(user) : "null"}`);

    if (!user || !user.id) {
      console.log("No user or user ID found, returning error.");
      return { error: "User must be authenticated to perform this action." };
    }

    console.log("User authenticated, fetching all repositories...");
    const repositories = await getAllRepositories();
    console.log(`Repositories fetched: ${repositories.length} found.`);

    return repositories as TRepository[];
  } catch (error) {
    console.error("Error in getAllRepositoriesAction:", error);
    return { error: "An unexpected error occurred." };
  } finally {
    console.log("getAllRepositoriesAction completed.");
  }
};
