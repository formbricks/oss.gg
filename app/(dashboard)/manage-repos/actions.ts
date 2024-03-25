"use server";

import { userHasPermissionForRepository } from "@/lib/repository/auth";
import { fetchRepoDetails, updateRepository } from "@/lib/repository/service";
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
  const userHasPermission = userHasPermissionForRepository(id, userId);
  if (!userHasPermission) throw new Error("Not authorized");
  return await updateRepository(id, true);
};

// Deactivates a single repository
export const deactivateRepoAction = async (id: string) => {
  const userId = await getUserId();
  const userHasPermission = userHasPermissionForRepository(id, userId);
  if (!userHasPermission) throw new Error("Not authorized");
  return await updateRepository(id, false);
};

// Fetches repository details
export const fetchRepoDetailsAction = async (id: string) => {
  return await fetchRepoDetails(id);
};
