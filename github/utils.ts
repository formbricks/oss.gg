import { readFileSync } from "fs"
import path from "path"
import { createAppAuth } from "@octokit/auth-app"
import { Octokit } from "@octokit/rest"

import { GITHUB_APP_APP_ID } from "./constants"

// const resolvedPath = path.resolve(__dirname, "../../../../key.pem")
const privateKeyPath =
  "/home/shubham/Downloads/ossgg-test.2024-01-18.private-key.pem"
// const resolvedPath = path.resolve(__dirname, privateKeyPath)
const resolvedPath = path.resolve(privateKeyPath)

const privateKey = readFileSync(resolvedPath, "utf8")

export const getOctokitInstance = (installationId: number) => {
  if (!installationId) {
    throw new Error("No installation id provided")
  }

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: GITHUB_APP_APP_ID!,
      privateKey,
      installationId,
    },
  })

  return octokit
}
