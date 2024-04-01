"use server";

import { deleteUserAccount } from "@/lib/account/service";
import { getCurrentUser } from "@/lib/session";
import { AuthorizationError } from "@/types/errors";

export async function deleteUserAction() {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError("Not authorized");

  return await deleteUserAccount(user.id);
}
