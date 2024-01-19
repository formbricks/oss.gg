import { readFileSync } from "fs"
import path from "path"
import { createAppAuth } from "@octokit/auth-app"
import { Octokit } from "@octokit/rest"

import { db } from "@/lib/db"

// import { generateGithubToken } from "../utils"

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
    console.log(
      "sendInstallationDetails",
      installationId,
      appId,
      repos,
      installation
    )

    console.log("Organization")
    console.log(installation?.account?.login)

    // const token = await generateGithubToken(installationId, appId)

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId,
        installationId,
        privateKey,
      },
    })

    if (installation?.account?.type === "Organization") {
      // const membersOfOrg = await fetch(
      //   `https://api.github.com/orgs/${installation?.account?.login}/members`,
      //   {
      //     headers: {
      //       Authorization: `Token ${token}`,
      //     },
      //   }
      // )
      // console.log(membersOfOrg)

      try {
        const membersOfOrg = await octokit.rest.orgs.listMembers({
          org: installation?.account?.login,
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
            const newMember = await db.user.create({
              data: {
                githubId: member.id,
                login: member.login,
              },
            })
            console.log({ newMember })
          }

          // check if this member has a membership
          // if not, create a new membership
        })
      } catch (error) {
        console.log({ error })
      }
    }

    // store installationId
    // get members from their orgs
    // and create memberships if it does not exist

    // const githubToken = await generateGithubToken(installationId, appId)
    // console.log(githubToken)

    // const

    return { data: "data" }
  } catch (error) {
    throw new Error(`Failed to post installation details: ${error}`)
  }
}
