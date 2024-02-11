"use server";

import { getAllRepositories } from "@/lib/repository/service";
import { getCurrentUser } from "@/lib/session";

export const getAllRepositoriesAction = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || !user.id) {
        return ({ error: "User must be authenticated to perform this action." });
      }
      const repositories = await getAllRepositories();
      return repositories;
    } catch (error) {
      console.error("Error fetching repositories:", error.message);
    }
  };