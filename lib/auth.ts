import { env } from "@/env.mjs";
import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { createAccount } from "./account/service";
import { enrollUserInAllRepositories } from "./enrollment/service";
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
    async signIn({ user, account, profile, ...rest }: any) {
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
            if (existingUserWithAccount.role === "user") {
              await enrollUserInAllRepositories(existingUserWithAccount.id);
            }
            return true;
          }

          // user seemed to change their core details within the provider
          // update them in the database
          const updatedUser = await db.user.update({
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

          if (existingUserWithAccount.role === "user") {
            await enrollUserInAllRepositories(updatedUser.id);
          }

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

        const { refresh_token_expires_in, ...accountInput } = account;
        await createAccount({ ...accountInput, userId: dbUser.id });

        // Enroll new user in all repositories
        await enrollUserInAllRepositories(dbUser.id);

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
        role: dbUser.role,
      };
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        if (token.avatarUrl) session.user.avatarUrl = token.avatarUrl as string;
        if (token.login) session.user.login = token.login as string;
        if (token.role) session.user.role = token.role as string;
      }

      return session;
    },
  },
};
