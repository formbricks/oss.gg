import { revalidateTag } from "next/cache";

type RevalidateProps = {
  githubLogin?: string;
}

export const githubUserCache = {
  tags: {
    byGithubLogin(githubLogin: string) {
      return [`github-users-${githubLogin}`];
    },
  },
  revalidate({ githubLogin }: RevalidateProps): void {
    if (githubLogin) {
      revalidateTag(this.tag.byGithubLogin(githubLogin));
    }
  },
};
