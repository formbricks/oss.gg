import { env } from "@/env.mjs";
import { db } from "@/lib/db";
import { readFileSync } from "fs";
import { App } from "octokit";
import path from "path";

const privateKeyPath = "../../../../key.pem";
const resolvedPath = path.resolve(__dirname, privateKeyPath);
const privateKey = readFileSync(resolvedPath, "utf8");

export const sendInstallationDetails = async (
  installationId: number,
  appId: number,
  repos:
    | {
        id: number;
        node_id: string;
        name: string;
        full_name: string;
        private: boolean;
      }[]
    | undefined,
  installation: any
): Promise<void> => {
  try {
    const app = new App({
      appId,
      privateKey,
      webhooks: {
        secret: env.GITHUB_WEBHOOK_SECRET!,
      },
    });
    const octokit = await app.getInstallationOctokit(installationId);

    await db.$transaction(async (tx) => {
      const installationPrisma = await tx.installation.upsert({
        where: { githubId: installationId },
        update: { type: installation?.account?.type.toLowerCase() },
        create: {
          githubId: installationId,
          type: installation?.account?.type.toLowerCase(),
        },
      });

      const userType = installation?.account?.type.toLowerCase();
      if (userType === "organization") {
        const membersOfOrg = await octokit.rest.orgs.listMembers({
          org: installation?.account?.login,
          role: "all",
        });

        await Promise.all(
          membersOfOrg.data.map(async (member) => {
            const newUser = await tx.user.upsert({
              where: { githubId: member.id },
              update: {},
              create: {
                githubId: member.id,
                login: member.login,
              },
            });

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
          })
        );
      } else {
        const user = installation.account;
        const newUser = await tx.user.upsert({
          where: { githubId: user.id },
          update: {},
          create: {
            githubId: user.id,
            login: user.login,
            name: user.name || "",
            email: user.email || "",
          },
        });

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
      }

      if (repos) {
        await Promise.all(
          repos.map(async (repo) => {
            await tx.repository.upsert({
              where: { githubId: repo.id },
              update: {},
              create: {
                githubId: repo.id,
                name: repo.name,
                installationId: installationPrisma.id,
              },
            });
          })
        );
      }
    });
  } catch (error) {
    console.error(`Failed to post installation details: ${error}`);
    throw new Error(`Failed to post installation details: ${error}`);
  }
};
