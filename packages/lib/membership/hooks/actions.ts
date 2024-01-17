"use server";

import "server-only";

import { AuthenticationError } from "@ossgg/types/errors";
import { TUser } from "@ossgg/types/user";
import { getServerSession } from "next-auth";

import { authOptions } from "../../authOptions";
import { getTeamByEnvironmentId } from "../../team/service";
import { getMembershipByUserIdTeamId } from "../service";

export const getMembershipByUserIdTeamIdAction = async (environmentId: string) => {
  const session = await getServerSession(authOptions);
  const team = await getTeamByEnvironmentId(environmentId);
  const user = session?.user as TUser;

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(user.id, team.id);

  if (!currentUserMembership) {
    throw new Error("Membership not found");
  }

  return currentUserMembership?.role;
};
