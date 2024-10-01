import { EmitterWebhookEvent } from "@octokit/webhooks";

import { sendInstallationDetails } from "../services/user";
import { githubCache } from "./cache";

type GitHubRepository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
};

export const onInstallationCreated = async (payload: EmitterWebhookEvent<"installation">["payload"]) => {
  const installationId = payload.installation.id;
  const appId = payload.installation.app_id;
  const repos = payload.repositories as GitHubRepository[];
  repos.forEach((repo) => {
    githubCache.revalidate({ repositoryId: repo.id });
  });
  await sendInstallationDetails(installationId, appId, repos, payload.installation);
};
