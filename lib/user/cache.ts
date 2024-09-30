import { revalidateTag } from "next/cache";

interface RevalidateProps {
  id?: string;
  login?: string;
  githubId?: number;
}

export const userCache = {
  tags: {
    byId(id: string) {
      return [`users-${id}`];
    },
    byLogin(login: string) {
      return [`users-${login}`];
    },
    byGithubId(githubId: number) {
      return [`users-${githubId}`];
    },
  },
  revalidate({ id, login, githubId }: RevalidateProps): void {
    if (id) {
      revalidateTag(this.tag.byId(id));
    }

    if (login) {
      revalidateTag(this.tag.byLogin(login));
    }

    if (githubId) {
      revalidateTag(this.tag.byGithubId(githubId));
    }
  },
};
