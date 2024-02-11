import { db } from "@/lib/db";
import { TAccount, TAccountInput, ZAccountInput } from "@/types/account";
import { DatabaseError } from "@/types/errors";

import { validateInputs } from "../utils/validate";

export const createAccount = async (accountData: TAccountInput): Promise<TAccount> => {
  validateInputs([accountData, ZAccountInput]);

  try {
    const account = await db.account.create({
      data: accountData,
    });
    return account;
  } catch (error) {
    if (error instanceof db.dbClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};
