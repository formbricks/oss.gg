import { revalidateTag } from "next/cache";

interface RevalidateProps {
  githubId?: string;
  id?: string;
  userId?: string;
}

export const repositoryCache = {
  tag: {
    byGithubId(githubId: number) {
      return `repository-${githubId}`;
    },
    byId(id: string) {
      return `repository-${id}`;
    },
    byUserId(userId: string) {
      return `repository-${userId}`;
    },
  },
  revalidate({ githubId, id, userId }: RevalidateProps): void {
    if (githubId) {
      revalidateTag(this.tag.byGithubId(githubId));
    }
    if (id) {
      revalidateTag(this.tag.byId(id));
    }
    if (userId) {
      revalidateTag(this.tag.byUserId(userId));
    }
  },
};
