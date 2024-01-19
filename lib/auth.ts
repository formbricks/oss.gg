import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account.type !== "oauth") {
        return false
      }

      if (account.provider) {
        // check if accounts for this provider / account Id already exists
        const existingUserWithAccount = await db.user.findFirst({
          include: {
            account: true,
          },
          where: {
            githubId: account.providerAccountId,
          },
        })

        if (existingUserWithAccount) {
          // User with this provider found
          // check if email still the same
          if (existingUserWithAccount.email === user.email) {
            return true
          }

          // user seemed to change his email within the provider
          // update the email in the database
          await db.user.update({
            where: {
              id: existingUserWithAccount.id,
            },
            data: {
              email: user.email,
            },
          })
          return true
        }

        // create user if it does not exist
        await db.user.create({
          data: {
            name: user.name,
            githubId: account.providerAccountId,
            email: user.email,
            avatarUrl: user.image,
            account: {
              create: {
                ...account,
              },
            },
          },
        })

        return true
      }

      return false
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatarUrl: dbUser.avatarUrl,
      }
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        if (token.name) session.user.name = token.name
        if (token.email) session.user.email = token.email
        if (token.avatarUrl) session.user.avatarUrl = token.avatarUrl as string
      }

      return session
    },
  },
}
