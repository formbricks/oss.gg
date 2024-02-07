import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import { readFileSync } from "fs";
import path from "path";

import { GITHUB_APP_APP_ID } from "./constants";

const privateKeyPath = "../../../../key.pem";
const resolvedPath = path.resolve(__dirname, privateKeyPath);
const privateKey = readFileSync(resolvedPath, "utf8");

export const getOctokitInstance = (installationId: number) => {
  if (!installationId) {
    throw new Error("No installation id provided");
  }

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: GITHUB_APP_APP_ID!,
      privateKey,
      installationId,
    },
  });

  return octokit;
};
