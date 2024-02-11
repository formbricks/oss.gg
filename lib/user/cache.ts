import { revalidateTag } from "next/cache";

interface RevalidateProps {
  id?: string;
  login?: string;
}

export const userCache = {
  tag: {
    byId(id: string) {
      return `users-${id}`;
    },
    byLogin(login: string) {
      return `users-${login}`;
    },
  },
  revalidate({ id, login }: RevalidateProps): void {
    if (id) {
      revalidateTag(this.tag.byId(id));
    }

    if (login) {
      revalidateTag(this.tag.byLogin(login));
    }
  },
};
