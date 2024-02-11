import { revalidateTag } from "next/cache";

interface RevalidateProps {
  githubLogin?: string;
}

export const githubUserCache = {
  tag: {
    byGithubLogin(githubLogin: string) {
      return `github-users-${githubLogin}`;
    },
  },
  revalidate({ githubLogin }: RevalidateProps): void {
    if (githubLogin) {
      revalidateTag(this.tag.byGithubLogin(githubLogin));
    }
  },
};
