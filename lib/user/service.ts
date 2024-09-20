import { db } from "@/lib/db";
import { ZId } from "@/types/common";
import { DatabaseError, ResourceNotFoundError } from "@/types/errors";
import { TUser, TUserCreateInput, TUserUpdateInput, ZUser, ZUserUpdateInput } from "@/types/user";
import { Prisma } from "@prisma/client";

import { repositoryCache } from "../repository/cache";
import { formatDateFields } from "../utils/datetime";
import { validateInputs } from "../utils/validate";

const userSelection = {
  id: true,
  createdAt: true,
  updatedAt: true,
  githubId: true,
  login: true,
  name: true,
  email: true,
  avatarUrl: true,
};

// function to retrive basic information about a user's user
export const getUser = async (id: string): Promise<TUser | null> => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: userSelection,
    });

    if (!user) {
      return null;
    }
    return {
      ...user,
      ...formatDateFields(user, ZUser),
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getPlayerByLogin = async (login: string): Promise<TUser | null> => {
  try {
    const user = await db.user.findFirst({
      where: {
        login,
      },
      select: userSelection,
    });
    if (!user) {
      return null;
    }

    return {
      ...user,
      ...formatDateFields(user, ZUser),
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getUserByGithubId = async (githubId: number): Promise<TUser | null> => {
  try {
    const user = await db.user.findFirst({
      where: {
        githubId,
      },
      select: userSelection,
    });
    if (!user) {
      return null;
    }

    return {
      ...user,
      ...formatDateFields(user, ZUser),
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

// function to update a user's user
export const updateUser = async (personId: string, data: TUserUpdateInput): Promise<TUser> => {
  validateInputs([personId, ZId], [data, ZUserUpdateInput.partial()]);

  try {
    const updatedUser = await db.user.update({
      where: {
        id: personId,
      },
      data: data,
      select: userSelection,
    });

    repositoryCache.revalidate({ userId: personId });

    return updatedUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2016") {
      throw new ResourceNotFoundError("User", personId);
    } else {
      throw error; // Re-throw any other errors
    }
  }
};

export const deleteUser = async (id: string): Promise<TUser> => {
  validateInputs([id, ZId]);

  const user = await db.user.delete({
    where: {
      id,
    },
    select: userSelection,
  });

  return user;
};

export const createUser = async (data: TUserCreateInput): Promise<TUser> => {
  validateInputs([data, ZUserUpdateInput]);

  const user = await db.user.create({
    data: data,
    select: userSelection,
  });

  return user;
};

/**
 * Fetches all users who are enrolled to a specific repository
 * @param repositoryId The unique identifier for the repository
 * @returns An array of users enrolled to the given repository.
 */

export const getUsersForRepository = async (repositoryId: string) => {
  try {
    const users = await db.user.findMany({
      where: {
        enrollments: {
          some: {
            repositoryId: repositoryId,
          },
        },
      },
      include: { pointTransactions: true },
    });

    return users;
  } catch (error) {
    throw new Error(`Failed to get users for repository: ${error.message}`);
  }
};
