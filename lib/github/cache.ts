import { revalidateTag } from "next/cache";

interface RevalidateProps {
  repoGithubId?: number;
}

export const githubCache = {
  tag: {
    byRepoGithubId(repoGithubId: number) {
      return `github-repo-${repoGithubId}`;
    },
  },
  revalidate({ repoGithubId }: RevalidateProps): void {
    if (repoGithubId) {
      revalidateTag(this.tag.byRepoGithubId(repoGithubId));
    }
  },
};
