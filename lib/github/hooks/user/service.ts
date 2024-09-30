import { GITHUB_APP_PRIVATE_KEY, GITHUB_APP_WEBHOOK_SECRET } from "@/lib/constants";
import { db } from "@/lib/db";
import { getRepositoryDefaultBranch, getRepositoryReadme } from "@/lib/github/repo";
import { App } from "octokit";

export const sendInstallationDetails = async (
  installationId: number,
  appId: number,
  repos:
    | {
        id: number;
        node_id: string;
        name: string;
        owner: string;
        full_name: string;
        private: boolean;
      }[]
    | undefined,
  installation: any
): Promise<void> => {
  console.log(`Starting sendInstallationDetails for installationId: ${installationId}`);
};

export const isMemberOfRepository = async (githubUsername: string, installationId: number) => {
  try {
    const user = await db.user.findFirst({
      where: {
        login: githubUsername,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      return false;
    }

    const membership = await db.membership.findFirst({
      where: {
        userId: user.id,
        installation: {
          githubId: installationId,
        },
      },
    });

    return !!membership;
  } catch (error) {
    console.error(`Failed to check if user is member of installation: ${error}`);
    throw new Error(`Failed to check if user is member of installation: ${error}`);
  }
};
