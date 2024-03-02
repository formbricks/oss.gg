import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import crypto from "node:crypto";

import {
  GITHUB_APP_CLIENT_ID,
  GITHUB_APP_CLIENT_SECRET,
  GITHUB_APP_ID,
  GITHUB_APP_PRIVATE_KEY,
} from "../constants";

export const getOctokitInstance = (installationId: number) => {
  if (!installationId) {
    throw new Error("No installation id provided");
  }

  //Converting PKCS#1 to PKCS#8
  //For it to work trigger it has to be in  PKCS#8 format

  const privateKeyPkcs8 = crypto.createPrivateKey(GITHUB_APP_PRIVATE_KEY).export({
    type: "pkcs8",
    format: "pem",
  });

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: GITHUB_APP_ID!,
      privateKey: privateKeyPkcs8!,
      installationId,
    },
  });

  return octokit;
};
