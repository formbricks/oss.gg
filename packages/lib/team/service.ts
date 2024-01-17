import "server-only";

import { prisma } from "@ossgg/database";
import { ZId, ZOptionalNumber, ZString } from "@ossgg/types/common";
import { DatabaseError, ResourceNotFoundError } from "@ossgg/types/errors";
import {
  TTeam,
  TTeamBilling,
  TTeamCreateInput,
  TTeamUpdateInput,
  ZTeam,
  ZTeamCreateInput,
} from "@ossgg/types/teams";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { formatDateFields } from "../utils/datetime";
import { validateInputs } from "../utils/validate";
import { teamCache } from "./cache";

const ITEMS_PER_PAGE = 10;

export const select = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  billing: true,
};

export const getTeamsTag = (teamId: string) => `teams-${teamId}`;
export const getTeamsByUserIdCacheTag = (userId: string) => `users-${userId}-teams`;
export const getTeamByEnvironmentIdCacheTag = (environmentId: string) => `environments-${environmentId}-team`;

export const getTeamsByUserId = async (userId: string, page?: number): Promise<TTeam[]> => {
  const teams = await unstable_cache(
    async () => {
      validateInputs([userId, ZString], [page, ZOptionalNumber]);

      try {
        const teams = await prisma.team.findMany({
          where: {
            memberships: {
              some: {
                userId,
              },
            },
          },
          select,
          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
        });
        if (!teams) {
          throw new ResourceNotFoundError("Teams by UserId", userId);
        }
        return teams;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getTeamsByUserId-${userId}-${page}`],
    {
      tags: [teamCache.tag.byUserId(userId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
  return teams.map((team) => formatDateFields(team, ZTeam));
};

export const getTeam = async (teamId: string): Promise<TTeam | null> => {
  const team = await unstable_cache(
    async () => {
      validateInputs([teamId, ZString]);

      try {
        const team = await prisma.team.findUnique({
          where: {
            id: teamId,
          },
          select,
        });
        return team;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getTeam-${teamId}`],
    {
      tags: [teamCache.tag.byId(teamId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
  return team ? formatDateFields(team, ZTeam) : null;
};

export const createTeam = async (teamInput: TTeamCreateInput): Promise<TTeam> => {
  try {
    validateInputs([teamInput, ZTeamCreateInput]);

    const team = await prisma.team.create({
      data: teamInput,
      select,
    });

    teamCache.revalidate({
      id: team.id,
    });

    return team;
  } catch (error) {
    throw error;
  }
};

export const updateTeam = async (teamId: string, data: Partial<TTeamUpdateInput>): Promise<TTeam> => {
  try {
    const updatedTeam = await prisma.team.update({
      where: {
        id: teamId,
      },
      data,
      select: { ...select, memberships: true }, // include memberships & environments
    });

    // revalidate cache for members
    updatedTeam?.memberships.forEach((membership) => {
      teamCache.revalidate({
        userId: membership.userId,
      });
    });

    const team = {
      ...updatedTeam,
      memberships: undefined,
      products: undefined,
    };

    teamCache.revalidate({
      id: team.id,
    });

    return team;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2016") {
      throw new ResourceNotFoundError("Team", teamId);
    } else {
      throw error; // Re-throw any other errors
    }
  }
};

export const deleteTeam = async (teamId: string): Promise<TTeam> => {
  validateInputs([teamId, ZId]);
  try {
    const deletedTeam = await prisma.team.delete({
      where: {
        id: teamId,
      },
      select: { ...select, memberships: true }, // include memberships & environments
    });

    // revalidate cache for members
    deletedTeam?.memberships.forEach((membership) => {
      teamCache.revalidate({
        userId: membership.userId,
      });
    });

    const team = {
      ...deletedTeam,
      memberships: undefined,
      products: undefined,
    };

    teamCache.revalidate({
      id: team.id,
    });

    return team;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};
