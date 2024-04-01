import { revalidateTag } from "next/cache";

interface RevalidateProps {
  repositoryId?: string;
}

export const pointsCache = {
  tag: {
    byRepositoryId(repositoryId: string) {
      return `repositories-${repositoryId}-points`;
    },
  },
  revalidate({ repositoryId }: RevalidateProps): void {
    if (repositoryId) {
      revalidateTag(this.tag.byRepositoryId(repositoryId));
    }
  },
};
