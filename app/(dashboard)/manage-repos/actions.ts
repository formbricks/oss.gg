"use server";

import { activateRepository, deactivateRepository, fetchRepoDetails } from "@/lib/github/services/repository";
import { getCurrentUser } from "@/lib/session";

async function getUserId() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You're not authorized to perfrom this action");
  }
  return user.id;
}

// Activates a single repository
export const activateRepoAction = async (id: string) => {
  const userId = await getUserId();
  return await activateRepository(id, userId);
};

// Deactivates a single repository
export const deactivateRepoAction = async (id: string) => {
  const userId = await getUserId();
  return await deactivateRepository(id, userId);
};

// Fetches repository details
export const fetchRepoDetailsAction = async (id: string) => {
  return await fetchRepoDetails(id);
};
