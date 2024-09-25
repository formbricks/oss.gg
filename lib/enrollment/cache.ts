import { revalidateTag } from "next/cache";

interface RevalidateProps {
  userId?: string;
  repositoryId?: string;
}

export const enrollmentCache = {
  tag: {
    byUserId(userId: string) {
      return `users-${userId}-enrollment`;
    },
    byRepositoryId(repositoryId: string) {
      return `repositories-${repositoryId}-enrollment`;
    },
    byUserIdAndRepositoryId(userId: string, repositoryId: string) {
      return `users-${userId}-repositories-${repositoryId}-enrollment`;
    },
  },
  revalidate({ userId, repositoryId }: RevalidateProps): void {
    if (userId) {
      revalidateTag(this.tag.byUserId(userId));
    }

    if (repositoryId) {
      revalidateTag(this.tag.byRepositoryId(repositoryId));
    }

    if (userId && repositoryId) {
      revalidateTag(this.tag.byUserIdAndRepositoryId(userId, repositoryId));
    }
  },
};
