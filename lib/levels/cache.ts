import { revalidateTag } from "next/cache";

interface RevalidateProps {
  repositoryId?: string;
}

export const levelsCache = {
  tag: {
    byRepositoryId(repositoryId: string) {
      return `repositories-${repositoryId}-levels`;
    },
  },
  revalidate({ repositoryId }: RevalidateProps): void {
    if (repositoryId) {
      revalidateTag(this.tag.byRepositoryId(repositoryId));
    }
  },
};
