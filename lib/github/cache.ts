import { revalidateTag } from "next/cache";

interface RevalidateProps {
  repoGithubId?: number;
  githubLogin?: string;
}

export const githubCache = {
  tag: {
    byRepoGithubId(repoGithubId: number) {
      return `github-repo-${repoGithubId}`;
    },
    byGithubLogin(githubLogin: string) {
      return `github-repo-${githubLogin}`;
    },
  },
  revalidate({ repoGithubId, githubLogin }: RevalidateProps): void {
    if (repoGithubId) {
      revalidateTag(this.tag.byRepoGithubId(repoGithubId));
    }
    if (githubLogin) {
      revalidateTag(this.tag.byGithubLogin(githubLogin));
    }
  },
};
