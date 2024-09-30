"use server";

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
  try {
    const app = new App({
      appId,
      privateKey: GITHUB_APP_PRIVATE_KEY,
      webhooks: {
        secret: GITHUB_APP_WEBHOOK_SECRET!,
      },
    });
    const octokit = await app.getInstallationOctokit(installationId);
    console.log(octokit);
    console.log(`Octokit instance created for installationId: ${installationId}`);

    console.log(`Starting database transaction for installationId: ${installationId}`);
    console.log({ installationId });
    console.log(installation?.account?.type.toLowerCase());
    console.log(installation?.account?.type.toLowerCase());
    let installationPrisma;

    const type = installation?.account?.type.toLowerCase() === "user" ? "user" : "organization"; // You can handle other cases as needed
    try {
      console.log({ db });
      installationPrisma = await db.installation.upsert({
        where: { githubId: installationId },
        update: { type: installation?.account?.type.toLowerCase() },
        create: {
          githubId: installationId,
          type: installation?.account?.type.toLowerCase(),
        },
      });
      console.log(`Installation upserted successfully:`, JSON.stringify(installationPrisma, null, 2));
    } catch (error) {
      console.error(`Error upserting installation:`, error);
      console.error(`Error details:`, JSON.stringify(error, null, 2));
      throw error; // Re-throw the error to stop execution if needed
    }

    const userType = installation?.account?.type.toLowerCase();
    console.log(`User type: ${userType}`);
    // if (userType === "organization") {
    //   console.log(`Processing organization members for ${installation?.account?.login}`);
    //   const membersOfOrg = await octokit.rest.orgs.listMembers({
    //     org: installation?.account?.login,
    //     role: "all",
    //   });s
    //   console.log(`Found ${membersOfOrg.data.length} members in the organization`);

    //   await Promise.all(
    //     membersOfOrg.data.map(async (member) => {
    //       console.log(`Processing member: ${member.login}`);
    //       const newUser = await db.user.upsert({
    //         where: { githubId: member.id },
    //         update: {},
    //         create: {
    //           githubId: member.id,
    //           login: member.login,
    //           name: member.name,
    //           email: member.email,
    //           avatarUrl: member.avatar_url,
    //         },
    //       });

    //       await db.membership.upsert({
    //         where: {
    //           userId_installationId: {
    //             userId: newUser.id,
    //             installationId: installationPrisma.id,
    //           },
    //         },
    //         update: {},
    //         create: {
    //           userId: newUser.id,
    //           installationId: installationPrisma.id,
    //           role: "member",
    //         },
    //       });
    //     })
    //   );
    // } else {
    //   console.log(`Processing individual user: ${installation.account.login}`);
    //   const user = installation.account;
    //   const newUser = await db.user.upsert({
    //     where: { githubId: user.id },
    //     update: {},
    //     create: {
    //       githubId: user.id,
    //       login: user.login,
    //       name: user.name,
    //       email: user.email,
    //       avatarUrl: user.avatar_url,
    //     },
    //   });

    //   await db.membership.upsert({
    //     where: {
    //       userId_installationId: {
    //         userId: newUser.id,
    //         installationId: installationPrisma.id,
    //       },
    //     },
    //     update: {},
    //     create: {
    //       userId: newUser.id,
    //       installationId: installationPrisma.id,
    //       role: "owner",
    //     },
    //   });
    // }

    // if (repos) {
    //   console.log(`Processing ${repos.length} repositories`);
    //   await Promise.all(
    //     repos.map(async (repo) => {
    //       console.log(`Processing repository: ${repo.name}`);
    //       const defaultBranch = await getRepositoryDefaultBranch(installation.account.login, repo.name);
    //       const readme = await getRepositoryReadme(installation.account.login, repo.name, defaultBranch);

    //       await db.repository.upsert({
    //         where: { githubId: repo.id },
    //         update: {},
    //         create: {
    //           githubId: repo.id,
    //           name: repo.name,
    //           owner: repo.full_name.split("/")[0],
    //           installationId: installationPrisma.id,
    //           logoUrl: `https://avatars.githubusercontent.com/u/${installation.account.id}?s=200&v=4`,
    //           default_branch: defaultBranch,
    //           projectDescription: readme,
    //         },
    //       });
    //     })
    //   );
    // } else {
    //   console.log("No repositories to process");
    // }

    console.log(`Completed sendInstallationDetails for installationId: ${installationId}`);
  } catch (error) {
    console.error(`Failed to post installation details: ${error}`);
    throw new Error(`Failed to post installation details: ${error}`);
  }
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
