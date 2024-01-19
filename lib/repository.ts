import { db } from "@/lib/db"

import { TRepository, TRepositoryCreateInput } from "./types/repository"

export const getRepository = async (
  repositoryId: string
): Promise<TRepository | null> => {
  try {
    const repositoryData = await db.repository.findUnique({
      where: {
        id: repositoryId,
      },
    })

    return repositoryData
  } catch (error) {
    throw error
  }
}

export const getRepositories = async (
  ownerId: string
): Promise<TRepository[]> => {
  try {
    const repositories = await db.repository.findMany({
      where: {
        ownerId,
      },
    })

    return repositories
  } catch (error) {
    throw error
  }
}

export const createRepository = async (
  repositoryData: TRepositoryCreateInput
): Promise<TRepository> => {
  try {
    const newRepository = await db.repository.create({
      data: repositoryData,
    })

    return newRepository
  } catch (error) {
    throw error
  }
}

export const deleteRepository = async (
  repositoryId: string
): Promise<TRepository | null> => {
  try {
    const deletedRepository = await db.repository.delete({
      where: {
        id: repositoryId,
      },
    })

    return deletedRepository
  } catch (error) {
    throw error
  }
}
