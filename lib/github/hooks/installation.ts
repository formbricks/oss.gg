import { EmitterWebhookEvent } from "@octokit/webhooks";

import { sendInstallationDetails } from "../services/user";

type GitHubRepository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
};

export const onInstallationCreated = async (payload: EmitterWebhookEvent<"installation">["payload"]) => {
  console.log("onInstallationCreated called with payload:", JSON.stringify(payload, null, 2));

  const installationId = payload.installation.id;
  const appId = payload.installation.app_id;
  const repos = payload.repositories as GitHubRepository[];

  console.log(`Processing installation: ${installationId}, appId: ${appId}, repos: ${repos.length}`);

  try {
    await sendInstallationDetails(installationId, appId, repos, payload.installation);
    console.log("sendInstallationDetails completed successfully");
  } catch (error) {
    console.error("Error in sendInstallationDetails:", error);
    throw error;
  }
};
