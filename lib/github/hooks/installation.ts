import { EVENT_TRIGGERS } from "@/lib/constants";
import { Webhooks } from "@octokit/webhooks";

import { sendInstallationDetails } from "../services/user";

type GitHubRepository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
};

export const onInstallationCreated = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.INSTALLATION_CREATED, async (context) => {
    const installationId = context.payload.installation.id;
    const appId = context.payload.installation.app_id;
    const repos = context.payload.repositories as GitHubRepository[];
    console.log("Installation created", installationId, appId, repos);

    await sendInstallationDetails(installationId, appId, repos, context.payload.installation);
  });
};
