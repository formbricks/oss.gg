import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import crypto from "node:crypto";

import { GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY } from "../constants";

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

export const extractIssueNumbers = (body: string): number[] => {
  const regex = /#(\d+)/g;
  const matches = body.match(regex);
  if (matches) {
    return matches.map((match) => parseInt(match.substring(1)));
  } else {
    return [];
  }
};

export const extractIssueNumbersFromPrBody = (body: string): number[] => {
  // Refer: https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue
  // Regex pattern to match both full URLs and shorthand references to issues
  const pattern =
    /\b(close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved)\b\s+(?:https:\/\/github\.com\/\w+\/\w+\/issues\/(\d+)|#(\d+))/gi;

  // Find matches and extract issue numbers
  const issueSet = new Set<number>(); // Using a Set to ensure uniqueness
  let match;
  while ((match = pattern.exec(body)) !== null) {
    // Adding the issue number to the Set, match[2] for full URL, match[3] for shorthand
    const issueNumber = match[2] || match[3];
    issueSet.add(Number(issueNumber));
  }
  const uniqueIssues = Array.from(issueSet);
  return uniqueIssues;
};

/**
 * Extracts points from a label name that includes the word "points" followed by a number.
 * @param labels - An array of GitHub labels.
 * @returns The points as a number or null if no points label is found.
 */
export const extractPointsFromLabels = (labels: { name: string }[]): number | null => {
  const pointsLabel = labels.find((label) => label.name.toLowerCase().includes("points"));

  if (pointsLabel) {
    const match = pointsLabel.name.match(/(\d+)/); // Match any sequence of digits
    if (match) {
      return parseInt(match[0], 10); // Convert the first matching group to an integer
    }
  }

  return null;
};
