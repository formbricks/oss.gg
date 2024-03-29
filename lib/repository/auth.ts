import { db } from "@/lib/db";

export const userHasPermissionForRepository = async (
  repositoryId: string,
  userId: string
): Promise<boolean> => {
  const repository = await db.repository.findUnique({
    where: { id: repositoryId },
    include: {
      installation: {
        include: {
          memberships: true,
        },
      },
    },
  });

  if (!repository) {
    return false;
  }

  const { installation } = repository;
  if (installation.type === "organization") {
    return installation.memberships.some((membership) => membership.userId === userId);
  } else {
    return installation.memberships.some(
      (membership) => membership.userId === userId && membership.role === "owner"
    );
  }
};
