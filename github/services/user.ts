import { generateGithubToken, generateJWT } from "../utils"

export const sendInstallationDetails = async (
  installationId: number,
  appId: number,
  repos: unknown,
  installation: unknown
): Promise<unknown> => {
  try {
    console.log(
      "sendInstallationDetails",
      installationId,
      appId,
      repos,
      installation
    )

    if (installation?.account?.type === "Organization") {
      console.log("Organization")
      console.log(installation?.account?.login)

      const token = await generateGithubToken(installationId, appId)
      console.log(token)

      const membersOfOrg = await fetch(
        `https://api.github.com/orgs/${installation?.account?.login}/members`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      console.log(membersOfOrg)
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
