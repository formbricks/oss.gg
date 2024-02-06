import { readFileSync } from "fs"
import path from "path"
import { App } from "octokit"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"

const privateKeyPath =
  "/home/shubham/Downloads/ossgg-test.2024-01-18.private-key.pem"
// const resolvedPath = path.resolve(__dirname, privateKeyPath)
const resolvedPath = path.resolve(privateKeyPath)
const privateKey = readFileSync(resolvedPath, "utf8")

export const sendInstallationDetails = async (
  installationId: number,
  appId: number,
  repos:
    | {
        id: number
        node_id: string
        name: string
        full_name: string
        private: boolean
      }[]
    | undefined,
  installation: any
): Promise<void> => {
  try {
    const config = {
      appId: appId,
      privateKey: privateKey,
      webhooks: {
        secret: env.GITHUB_WEBHOOK_SECRET!,
      },
    }
    const app = new App(config)
    const octokit = await app.getInstallationOctokit(installationId)

    const result = await db.$transaction(async (tx) => {
      const installationPrisma = await tx.installation.upsert({
        where: { githubId: installationId },
        update: {
          githubId: installationId,
          type: installation?.account?.type.toLowerCase(),
        },
        create: {
          githubId: installationId,
          type: installation?.account?.type.toLowerCase(),
        },
      })

      if (installation?.account?.type.toLowerCase() === "organization") {
        const membersOfOrg = await octokit.rest.orgs.listMembers({
          org: installation?.account?.login,
          role: "all",
        })

        for (const member of membersOfOrg.data) {
          const newUser = await tx.user.upsert({
            where: { githubId: member.id },
            update: {},
            create: {
              githubId: member.id,
              login: member.login,
            },
          })

          await tx.membership.upsert({
            where: {
              userId_installationId: {
                userId: newUser.id,
                installationId: installationPrisma.id,
              },
            },
            update: {},
            create: {
              userId: newUser.id,
              installationId: installationPrisma.id,
              role: "member",
            },
          })
        }
      } else {
        const user = installation.account
        const newUser = await tx.user.upsert({
          where: {
            githubId: user.id,
          },
          update: {},
          create: {
            githubId: user.id,
            login: user.login,
            name: user.name,
            email: user.email,
          },
        })

        await tx.membership.upsert({
          where: {
            userId_installationId: {
              userId: newUser.id,
              installationId: installationPrisma.id,
            },
          },
          update: {},
          create: {
            userId: newUser.id,
            installationId: installationPrisma.id,
            role: "owner",
          },
        })
      }
      if (!repos) {
        return
      }
      for (const repo of repos) {
        await tx.repository.upsert({
          where: { githubId: repo.id },
          update: {},
          create: {
            githubId: repo.id,
            name: repo.name,
            installationId: installationPrisma.id,
          },
        })
      }
    })

    return result
  } catch (error) {
    throw new Error(`Failed to post installation details: ${error}`)
  }
}
