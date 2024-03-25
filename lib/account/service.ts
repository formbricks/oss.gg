import { db } from "@/lib/db";
import { TAccount, TAccountInput, ZAccountInput } from "@/types/account";
import { DatabaseError } from "@/types/errors";
import { MembershipRole, Prisma } from "@prisma/client";



import { validateInputs } from "../utils/validate";


export const createAccount = async (accountData: TAccountInput): Promise<TAccount> => {
  validateInputs([accountData, ZAccountInput]);

  try {
    const account = await db.account.create({
      data: accountData,
    });
    return account;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const deleteUserAccount = async (id: string): Promise<void> => {
  try {
    await db.$transaction(async (prisma) => {
      const members = await prisma.membership.findMany({
        where: {
          userId: id,
          role: MembershipRole.owner,
        },
      });

      for (const memberItem of members) {
        const repositories = await prisma.repository.findMany({
          where: {
            installationId: memberItem.installationId,
          },
        });

        for (const repository of repositories) {
          await prisma.pointTransaction.deleteMany({
            where: {
              repositoryId: repository.id,
            },
          });

          await prisma.enrollment.deleteMany({
            where: {
              repositoryId: repository.id,
            },
          });

          await prisma.repository.delete({
            where: {
              id: repository.id,
            },
          });
        }

        await prisma.installation.delete({
          where: {
            id: memberItem.installationId,
          },
        });
      }

      await prisma.user.delete({
        where: {
          id,
        },
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(`Error deleting user account: ${error.message}`);
    } else {
      console.error("Error deleting user account:", error);
    }
  }
};