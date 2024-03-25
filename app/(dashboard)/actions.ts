"use server";

import { getAllRepositories } from "@/lib/repository/service";
import { getCurrentUser } from "@/lib/session";
import { TRepository } from "@/types/repository";

export const getAllRepositoriesAction = async (): Promise<{ error: string } | TRepository[]> => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return { error: "User must be authenticated to perform this action." };
    }

    const repositories = await getAllRepositories();

    return repositories as TRepository[];
  } catch (error) {
    console.error("Error in getAllRepositoriesAction:", error);
    return { error: "An unexpected error occurred." };
  } finally {
  }
};
