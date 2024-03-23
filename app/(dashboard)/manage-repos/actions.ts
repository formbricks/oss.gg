"use server";

import { activateRepository, deactivateRepository, fetchRepoDetails } from "@/lib/github/services/repository";

// Activates a single repository
export const activateRepoAction = async (id: string, userId: string) => {
  return await activateRepository(id, userId);
};

// Deactivates a single repository
export const deactivateRepoAction = async (id: string, userId: string) => {
  return await deactivateRepository(id, userId);
};

// Deactivates a single repository
export const fetchRepoDetailsAction = async (id: string) => {
  return await fetchRepoDetails(id);
};
