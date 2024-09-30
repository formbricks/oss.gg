import { revalidateTag } from "next/cache";

interface RevalidateProps {
  repositoryId?: string;
}

export const repositoryCache = {
  tags: {
    all: () => ["repositories"],
    byId: (repositoryId: string) => [`repository-${repositoryId}`]
  },
  revalidate({ repositoryId }: RevalidateProps): void {
    revalidateTag(this.tags.all());
    if (repositoryId) {
      revalidateTag(this.tag.byId(repositoryId));
    }


  },
};
