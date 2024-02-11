"use server";

import { selectRepository } from "@/lib/github/services/repository";

export const selectRepoActions = async (id: string) => {
  return await selectRepository(id);
};
