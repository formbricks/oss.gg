import { db } from "@/lib/db";
import { ZId } from "@/types/common";
import { DatabaseError, ResourceNotFoundError } from "@/types/errors";
import { TUser, TUserCreateInput, TUserUpdateInput, ZUser, ZUserUpdateInput } from "@/types/user";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { z } from "zod";

import { DEFAULT_CACHE_REVALIDATION_INTERVAL } from "../constants";
import { formatDateFields } from "../utils/datetime";
import { validateInputs } from "../utils/validate";
import { userCache } from "./cache";

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
  const user = await unstable_cache(
    async () => {
      validateInputs([id, ZId]);

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
        return user;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getUser-${id}`],
    {
      tags: [userCache.tag.byId(id)],
      revalidate: DEFAULT_CACHE_REVALIDATION_INTERVAL,
    }
  )();

  return user
    ? {
        ...user,
        ...formatDateFields(user, ZUser),
      }
    : null;
};

export const getUserByLogin = async (login: string): Promise<TUser | null> => {
  const user = await unstable_cache(
    async () => {
      validateInputs([login, z.string()]);

      try {
        const user = await db.user.findFirst({
          where: {
            login,
          },
          select: userSelection,
        });

        return user;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getUserByLogin-${login}`],
    {
      tags: [userCache.tag.byLogin(login)],
      revalidate: DEFAULT_CACHE_REVALIDATION_INTERVAL,
    }
  )();

  return user
    ? {
        ...user,
        ...formatDateFields(user, ZUser),
      }
    : null;
};

export const getUserByGithubId = async (githubId: number): Promise<TUser | null> => {
  const user = await unstable_cache(
    async () => {
      validateInputs([githubId, z.number()]);

      try {
        const user = await db.user.findFirst({
          where: {
            githubId,
          },
          select: userSelection,
        });

        return user;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getUserByGithubId-${githubId}`],
    {
      tags: [userCache.tag.byGithubId(githubId)],
      revalidate: DEFAULT_CACHE_REVALIDATION_INTERVAL,
    }
  )();

  return user
    ? {
        ...user,
        ...formatDateFields(user, ZUser),
      }
    : null;
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

    userCache.revalidate({
      login: updatedUser.login,
      id: updatedUser.id,
    });

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

  userCache.revalidate({
    login: user.login,
    id,
  });

  return user;
};

export const createUser = async (data: TUserCreateInput): Promise<TUser> => {
  validateInputs([data, ZUserUpdateInput]);

  const user = await db.user.create({
    data: data,
    select: userSelection,
  });

  userCache.revalidate({
    login: user.login,
    id: user.id,
  });

  return user;
};
