import { GITHUB_APP_PRIVATE_KEY, GITHUB_APP_WEBHOOK_SECRET } from "@/lib/constants";
import { db } from "@/lib/db";
import { getRepositoryDefaultBranch, getRepositoryReadme } from "@/lib/github/services/repo";
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
  console.log(`Starting sendInstallationDetails with installationId: ${installationId}, appId: ${appId}`);
  console.log(`Repos:`, JSON.stringify(repos, null, 2));
  console.log(`Installation:`, JSON.stringify(installation, null, 2));

  try {
    console.log(`Creating App instance with appId: ${appId}`);
    const app = new App({
      appId,
      privateKey: GITHUB_APP_PRIVATE_KEY,
      webhooks: {
        secret: GITHUB_APP_WEBHOOK_SECRET!,
      },
    });
    console.log(`App instance created successfully`);

    console.log(`Getting installation Octokit for installationId: ${installationId}`);
    const octokit = await app.getInstallationOctokit(installationId);
    console.log(`Octokit instance obtained successfully`);

    console.log("About to start database transaction");
    await db
      .$transaction(async (tx) => {
        console.log(`Starting database transaction`);

        console.log(`Upserting installation with githubId: ${installationId}`);
        const installationPrisma = await tx.installation.upsert({
          where: { githubId: installationId },
          update: { type: installation?.account?.type.toLowerCase() },
          create: {
            githubId: installationId,
            type: installation?.account?.type.toLowerCase(),
          },
        });
        console.log(`Installation upserted successfully:`, installationPrisma);

        const userType = installation?.account?.type.toLowerCase();
        console.log(`User type: ${userType}`);

        if (userType === "organization") {
          console.log(`Processing organization members`);
          const membersOfOrg = await octokit.rest.orgs.listMembers({
            org: installation?.account?.login,
            role: "all",
          });
          console.log(`Found ${membersOfOrg.data.length} members in the organization`);

          await Promise.all(
            membersOfOrg.data.map(async (member) => {
              console.log(`Processing member: ${member.login}`);
              const newUser = await tx.user.upsert({
                where: { githubId: member.id },
                update: {},
                create: {
                  githubId: member.id,
                  login: member.login,
                  name: member.name,
                  email: member.email,
                  avatarUrl: member.avatar_url,
                },
              });
              console.log(`User upserted:`, newUser);

              await tx.membership.upsert({
                where: {
                  userId_installationId: {
                    userId: newUser.id,
                    installationId: installationPrisma.id,
                  },
                },
                update: {},
                create: {
                  userId: newUser.id,
                  installationId: installationPrisma.id,
                  role: "member",
                },
              });
              console.log(`Membership upserted for user: ${newUser.login}`);
            })
          );
        } else {
          console.log(`Processing individual user`);
          const user = installation.account;
          const newUser = await tx.user.upsert({
            where: { githubId: user.id },
            update: {},
            create: {
              githubId: user.id,
              login: user.login,
              name: user.name,
              email: user.email,
              avatarUrl: user.avatar_url,
            },
          });
          console.log(`User upserted:`, newUser);

          await tx.membership.upsert({
            where: {
              userId_installationId: {
                userId: newUser.id,
                installationId: installationPrisma.id,
              },
            },
            update: {},
            create: {
              userId: newUser.id,
              installationId: installationPrisma.id,
              role: "owner",
            },
          });
          console.log(`Membership upserted for user: ${newUser.login}`);
        }

        if (repos) {
          console.log(`Processing ${repos.length} repositories`);
          await Promise.all(
            repos.map(async (repo) => {
              console.log(`Processing repository: ${repo.name}`);
              const defaultBranch = await getRepositoryDefaultBranch(installation.account.login, repo.name);
              console.log(`Default branch for ${repo.name}: ${defaultBranch}`);
              const readme = await getRepositoryReadme(installation.account.login, repo.name, defaultBranch);
              console.log(`README fetched for ${repo.name}, length: ${readme.length}`);

              await tx.repository.upsert({
                where: { githubId: repo.id },
                update: {},
                create: {
                  githubId: repo.id,
                  name: repo.name,
                  owner: repo.full_name.split("/")[0],
                  installationId: installationPrisma.id,
                  logoUrl: `https://avatars.githubusercontent.com/u/${installation.account.id}?s=200&v=4`,
                  default_branch: defaultBranch,
                  projectDescription: readme,
                },
              });
              console.log(`Repository upserted: ${repo.name}`);
            })
          );
        }

        console.log("Database transaction completed successfully");
      })
      .catch((error) => {
        console.error("Error in database transaction:", error);
        throw error;
      });

    console.log(`sendInstallationDetails completed successfully`);
  } catch (error) {
    console.error(`Failed to post installation details:`, error);
    console.error(`Error stack:`, error instanceof Error ? error.stack : "No stack trace available");
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
