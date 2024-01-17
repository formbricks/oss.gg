import { prisma } from "@ossgg/database";
import type { IdentityProvider } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { createAccount } from "../account/service";
import { GITHUB_ID, GITHUB_SECRET } from "../constants";
import { createMembership } from "../membership/service";
import { createTeam } from "../team/service";
import { createUser, getUserByEmail, updateUser } from "../user/service";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: GITHUB_ID || "",
      clientSecret: GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      const existingUser = await getUserByEmail(token?.email!);

      if (!existingUser) {
        return token;
      }

      return {
        ...token,
        profile: existingUser || null,
      };
    },
    async session({ session, token }) {
      session.user.id = token?.id;
      session.user = token.profile;

      return session;
    },
    async signIn({ user, account }: any) {
      if (!user.email || !user.name || account.type !== "oauth") {
        return false;
      }

      if (account.provider) {
        const provider = account.provider.toLowerCase().replace("-", "") as IdentityProvider;
        // check if accounts for this provider / account Id already exists
        const existingUserWithAccount = await prisma.user.findFirst({
          include: {
            accounts: {
              where: {
                provider: account.provider,
              },
            },
          },
          where: {
            identityProvider: provider,
            identityProviderAccountId: account.providerAccountId,
          },
        });

        if (existingUserWithAccount) {
          // User with this provider found
          // check if email still the same
          if (existingUserWithAccount.email === user.email) {
            return true;
          }

          // user seemed to change his email within the provider
          // check if user with this email already exist
          // if not found just update user with new email address
          // if found throw an error (TODO find better solution)
          const otherUserWithEmail = await getUserByEmail(user.email);

          if (!otherUserWithEmail) {
            await updateUser(existingUserWithAccount.id, { email: user.email });
            return true;
          }
          throw new Error(
            "Looks like you updated your email somewhere else. A user with this new email exists already."
          );
        }

        // There is no existing account for this identity provider / account id
        // check if user account with this email already exists
        // if user already exists throw error and request password login
        const existingUserWithEmail = await getUserByEmail(user.email);

        if (existingUserWithEmail) {
          throw new Error("A user with this email exists already.");
        }

        const userProfile = await createUser({
          name: user.name,
          email: user.email,
          emailVerified: new Date(Date.now()),
          onboardingCompleted: false,
          identityProvider: provider,
          identityProviderAccountId: account.providerAccountId,
        });

        const team = await createTeam({ name: userProfile.name + "'s Team" });
        await createMembership(team.id, userProfile.id, { role: "owner", accepted: true });
        await createAccount({
          ...account,
          userId: userProfile.id,
        });
        return true;
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/login", // Error code passed in query string as ?error=
  },
};
