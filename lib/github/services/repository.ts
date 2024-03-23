import { db } from "@/lib/db";

// Activate a single repository
export const activateRepository = async (id: string) => {
  try {
    return await db.repository.update({
      where: { id },
      data: { configured: true },
    });
  } catch (error) {
    throw new Error(`Failed to activate repository: ${error}`);
  }
};

// Deactivate a single repository
export const deactivateRepository = async (id: string) => {
  try {
    return await db.repository.update({
      where: { id },
      data: { configured: false },
    });
  } catch (error) {
    throw new Error(`Failed to deactivate repository: ${error}`);
  }
};

export const fetchRepoDetails = async (id: string) => {
  try {
    return await db.repository.findUnique({
      where: { id },
    });
  } catch (error) {
    throw new Error(`Failed to fetch repository details: ${error}`);
  }
};

export const getRepositoriesForUser = async (userId: string) => {
  try {
    const userMemberships = await db.membership.findMany({
      where: {
        userId,
      },
    });

    if (userMemberships.length === 0) {
      return [];
    }

    const installationIds = userMemberships.map((membership) => membership.installationId);
    const userRepositories = await db.repository.findMany({
      where: {
        installationId: {
          in: installationIds,
        },
      },
    });

    userRepositories.sort((repoA, repoB) => repoA.name.localeCompare(repoB.name));

    return userRepositories;
  } catch (error) {
    throw new Error(`Failed to get repositories for user: ${error}`);
  }
};
