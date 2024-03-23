"use server";

import { activateRepository, deactivateRepository, fetchRepoDetails } from "@/lib/github/services/repository";

// Activates a single repository
export const activateRepoAction = async (id: string) => {
  return await activateRepository(id);
};

// Deactivates a single repository
export const deactivateRepoAction = async (id: string) => {
  return await deactivateRepository(id);
};

// Deactivates a single repository
export const fetchRepoDetailsAction = async (id: string) => {
  return await fetchRepoDetails(id);
};
