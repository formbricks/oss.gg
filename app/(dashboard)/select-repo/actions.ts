"use server"

import { selectRepository } from "@/github/services/repository"

export const selectRepoActions = async (id: string) => {
  return await selectRepository(id)
}
