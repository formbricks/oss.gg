import { revalidateTag } from "next/cache";

type RevalidateProps = {
  userId?: string;
}

export const enrolledRepositoriesCache = {
  tags: {
    byUserId(userId: string) {
      return [`enrolled-repositories-${userId}`];
    },
  },
  revalidate({ userId }: RevalidateProps): void {
    if (userId) {
      revalidateTag(this.tags.byUserId(userId));
    }
  },
};
