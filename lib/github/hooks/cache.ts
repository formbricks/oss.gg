import { revalidateTag } from "next/cache";

interface RevalidateProps {
  repositoryId?: number;
}

export const githubCache = {
  tag: {
    byRepositoryId(repositoryId: number) {
      return `github-${repositoryId}`;
    },
  },
  revalidate({ repositoryId }: RevalidateProps): void {
    if (repositoryId) {
      revalidateTag(this.tag.byRepositoryId(repositoryId));
    }
  },
};
