import { env } from "@/env.mjs";
import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { createAccount } from "./account/service";
import { createUser } from "./user/service";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_APP_CLIENT_ID,
      clientSecret: env.GITHUB_APP_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account.type !== "oauth") {
        return false;
      }

      if (account.provider) {
        // check if accounts for this provider / account Id already exists
        const existingUserWithAccount = await db.user.findFirst({
          include: {
            account: true,
          },
          where: {
            githubId: profile.id,
          },
        });

        if (existingUserWithAccount) {
          // User with this provider found
          // check if email & metadata is still the same
          if (
            existingUserWithAccount.email === user.email &&
            existingUserWithAccount.name === user.name &&
            existingUserWithAccount.avatarUrl === user.avatarUrl
          ) {
            return true;
          }

          // user seemed to change their core details within the provider
          // update them in the database
          await db.user.update({
            where: {
              id: existingUserWithAccount.id,
            },
            data: {
              name: profile.name,
              githubId: profile.id,
              login: profile.login,
              email: profile.email,
              avatarUrl: profile.avatar_url,
            },
          });
          return true;
        }

        // create user if it does not exist
        const dbUser = await createUser({
          name: profile.name,
          githubId: profile.id,
          login: profile.login,
          email: profile.email,
          avatarUrl: profile.avatar_url,
        });

        await createAccount({ ...account, userId: dbUser.id });

        return true;
      }

      return false;
    },
    async jwt({ token, user }) {
      if (!token.sub) {
        return token;
      }

      const dbUser = await db.user.findFirst({
        where: {
          githubId: parseInt(token.sub),
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatarUrl: dbUser.avatarUrl,
        login: dbUser.login,
      };
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        if (token.avatarUrl) session.user.avatarUrl = token.avatarUrl as string;
        if (token.login) session.user.login = token.login as string;
      }

      return session;
    },
  },
};
