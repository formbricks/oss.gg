import { revalidateTag } from "next/cache";

interface RevalidateProps {
  repositoryId?: string;
}

export const bountySettingsCache = {
  tag: {
    byRepositoryId(repositoryId: string) {
      return `repositories-${repositoryId}-bounty-settings`;
    },
  },
  revalidate({ repositoryId }: RevalidateProps): void {
    if (repositoryId) {
      revalidateTag(this.tag.byRepositoryId(repositoryId));
    }
  },
};
