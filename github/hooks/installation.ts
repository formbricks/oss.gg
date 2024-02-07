import { Webhooks } from "@octokit/webhooks";

import { EVENT_TRIGGERS } from "../constants";
import { sendInstallationDetails } from "../services/user";

export const onInstallationCreated = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.INSTALLATION_CREATED, async (context) => {
    const installationId = context.payload.installation.id;
    const appId = context.payload.installation.app_id;
    const repos = context.payload.repositories;

    await sendInstallationDetails(installationId, appId, repos, context.payload.installation);
  });
};
