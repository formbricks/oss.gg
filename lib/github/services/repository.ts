import { db } from "@/lib/db";

// Activate a single repository with updated checks
export const activateRepository = async (id: string, userId: string) => {
  try {
    const repository = await db.repository.findUnique({
      where: { id },
      include: {
        installation: {
          include: {
            memberships: true,
          },
        },
      },
    });

    if (!repository) {
      throw new Error("Repository not found.");
    }

    const { installation } = repository;
    let userHasPermission = false;

    // Check if the installation is of type 'organization'
    if (installation.type === "organization") {
      // Any member can change the configuration
      userHasPermission = installation.memberships.some((membership) => membership.userId === userId);
    } else {
      // For user installations, only owners can change the configuration
      userHasPermission = installation.memberships.some(
        (membership) => membership.userId === userId && membership.role === "owner"
      );
    }

    if (!userHasPermission) {
      throw new Error("User does not have permission to activate this repository.");
    }

    return await db.repository.update({
      where: { id },
      data: { configured: true },
    });
  } catch (error) {
    throw new Error(`Failed to activate repository: ${error}`);
  }
};

// Deactivate a single repository with updated checks
export const deactivateRepository = async (id: string, userId: string) => {
  try {
    const repository = await db.repository.findUnique({
      where: { id },
      include: {
        installation: {
          include: {
            memberships: true,
          },
        },
      },
    });

    if (!repository) {
      throw new Error("Repository not found.");
    }

    const { installation } = repository;
    let userHasPermission = false;

    if (installation.type === "organization") {
      // Any member can change the configuration
      userHasPermission = installation.memberships.some((membership) => membership.userId === userId);
    } else {
      // For user installations, only owners can change the configuration
      userHasPermission = installation.memberships.some(
        (membership) => membership.userId === userId && membership.role === "owner"
      );
    }

    if (!userHasPermission) {
      throw new Error("User does not have permission to deactivate this repository.");
    }

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
