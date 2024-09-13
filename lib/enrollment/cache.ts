import { revalidateTag } from "next/cache";

interface RevalidateProps {
  userId?: string;
  repositoryId?: string;
}

const createTagByUserId = (userId: string): string => `users-${userId}-enrollment`;
const createTagByRepositoryId = (repositoryId: string): string => `repositories-${repositoryId}-enrollment`;
const createTagByUserIdAndRepositoryId = (userId: string, repositoryId: string): string =>
  `users-${userId}-repositories-${repositoryId}-enrollment`;

const revalidateEnrollmentCache = ({ userId, repositoryId }: RevalidateProps): void => {
  if (userId) {
    revalidateTag(createTagByUserId(userId));
  }

  if (repositoryId) {
    revalidateTag(createTagByRepositoryId(repositoryId));
  }

  if (userId && repositoryId) {
    revalidateTag(createTagByUserIdAndRepositoryId(userId, repositoryId));
  }
};

export const enrollmentCache = {
  tag: {
    byUserId: createTagByUserId,
    byRepositoryId: createTagByRepositoryId,
    byUserIdAndRepositoryId: createTagByUserIdAndRepositoryId,
  },
  revalidate: revalidateEnrollmentCache,
};
