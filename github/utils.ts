import fs from "fs"
import path from "path"
import { createAppAuth } from "@octokit/auth-app"
import { Octokit } from "@octokit/rest"
import jwt from "jsonwebtoken"

const privateKeyPath = "../../../../key.pem"

const resolvedPath = path.resolve(__dirname, privateKeyPath)
const privateKey = fs.readFileSync(resolvedPath, "utf8")

export const generateJWT = (appId: number): string => {
  // Resolve the path from the current working directory
  const resolvedPath = path.resolve(__dirname, privateKeyPath)
  console.log("Resolved Private Key Path:", resolvedPath)

  // Read private key contents
  const privateKey = fs.readFileSync(resolvedPath, "utf8")

  // Define the payload
  const payload = {
    // issued at time, 60 seconds in the past to allow for clock drift
    iat: Math.floor(Date.now() / 1000) - 60,
    // JWT expiration time (10 minute maximum)
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
    // GitHub App's identifier
    iss: appId.toString(),
  }

  // Generate the JWT
  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" })
  return token
}

export const generateGithubToken = async (
  installationId: number,
  appId: number
): Promise<string> => {
  // const jwt = generateJWT(appId)

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      installationId,
      privateKey,
    },
  })

  const response = await octokit.rest.apps.createInstallationAccessToken({
    installation_id: installationId,
  })

  // const url = `https://api.github.com/app/installations/${installationId}/access_tokens`
  // try {
  //   const response = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/vnd.github.v3+json",
  //       Authorization: `Bearer ${jwt}`,
  //     },
  //   })

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`)
  //   }

  //   const data = await response.json()
  //   return data.token
  // } catch (error) {
  //   throw new Error(`Failed to generate Github token: ${error}`)
  // }
}
