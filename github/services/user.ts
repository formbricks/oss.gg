import { readFileSync } from "fs"
import path from "path"
import { createAppAuth } from "@octokit/auth-app"
import { Octokit } from "@octokit/rest"

import { db } from "@/lib/db"

const privateKeyPath = "../../../../key.pem"
const resolvedPath = path.resolve(__dirname, privateKeyPath)
const privateKey = readFileSync(resolvedPath, "utf8")

export const sendInstallationDetails = async (
  installationId: number,
  appId: number,
  repos: any,
  installation: any
): Promise<unknown> => {
  try {
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId,
        installationId,
        privateKey,
      },
    })

    const installationPrisma = await db.installation.create({
      data: {
        githubId: installationId,
        type: installation?.account?.type.toLowerCase(),
      },
    })

    if (installationPrisma.type === "organization") {
      try {
        const membersOfOrg = await octokit.rest.orgs.listMembers({
          org: installation?.account?.login,
          role: "all",
        })

        membersOfOrg.data.map(async (member) => {
          // check if this member exists in the database
          // if not, create a new member

          const memberInDatabase = await db.user.findUnique({
            where: {
              githubId: member.id,
            },
          })

          if (!memberInDatabase) {
            const newUser = await db.user.upsert({
              where: {
                githubId: member.id,
              },
              create: {
                githubId: member.id,
                login: member.login,
                name: member.name,
                email: member.email,
              },
              update: {
                githubId: member.id,
                login: member.login,
                name: member.name,
                email: member.email,
              },
            })

            // create a new membership
            const newMembership = await db.membership.create({
              data: {
                user: {
                  connect: {
                    id: newUser.id,
                  },
                },
                installation: { connect: { id: installationPrisma.id } },
                role: "member",
              },
            })
          }

          // check if this member has a membership
          // if not, create a new membership
        })
      } catch (error) {
        console.error({ error })
      }
    } else {
      const user = installation.account

      const newUser = await db.user.upsert({
        where: {
          githubId: user.id,
        },
        create: {
          githubId: user.id,
          login: user.login,
          name: user.name,
          email: user.email,
        },
        update: {
          githubId: user.id,
          login: user.login,
          name: user.name,
          email: user.email,
        },
      })

      // create a new membership
      const newMembership = await db.membership.create({
        data: {
          user: {
            connect: {
              id: newUser.id,
            },
          },
          installation: { connect: { id: installationPrisma.id } },
          role: "owner",
        },
      })
    }

    return { data: "data" }
  } catch (error) {
    throw new Error(`Failed to post installation details: ${error}`)
  }
}
