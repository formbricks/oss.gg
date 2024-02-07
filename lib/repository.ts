import { db } from "@/lib/db";

import { TRepository, TRepositoryCreateInput } from "../types/repository";

export const getRepository = async (id: string): Promise<TRepository | null> => {
  try {
    const repositoryData = await db.repository.findUnique({
      where: {
        id,
      },
    });

    return repositoryData;
  } catch (error) {
    throw error;
  }
};

export const createRepository = async (repositoryData: TRepositoryCreateInput): Promise<TRepository> => {
  try {
    const newRepository = await db.repository.create({
      data: repositoryData,
    });

    return newRepository;
  } catch (error) {
    throw error;
  }
};

export const deleteRepository = async (repositoryId: string): Promise<TRepository | null> => {
  try {
    const deletedRepository = await db.repository.delete({
      where: {
        id: repositoryId,
      },
    });

    return deletedRepository;
  } catch (error) {
    throw error;
  }
};

export async function hasUserAccessToRepository(userId: string, repositoryId: string): Promise<boolean> {
  const repository = await db.repository.findUnique({
    where: { id: repositoryId },
    select: { installation: true },
  });

  if (!repository || !repository.installation) {
    return false; // Repository or its installation not found
  }

  const installationId = repository.installation.id;

  // Check if there is a membership for the user in this installation
  const membership = await db.membership.findFirst({
    where: {
      userId,
      installationId,
    },
  });

  return membership?.userId === userId; // true if membership exists, false otherwise
}
