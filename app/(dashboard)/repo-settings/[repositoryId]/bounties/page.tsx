import { BountySettingsForm } from "@/components/forms/bounty-form";
import { getBountySettingsByRepositoryId } from "@/lib/bounty/service";

export const metadata = {
  title: "Bounty settings",
  description: "Control how bounties are given out including thresholds.",
};

export default async function BountySettings({ params }) {
  const repositoryId = params.repositoryId;
  const bountySettings = await getBountySettingsByRepositoryId(repositoryId)();

  return (
    <div>
      <BountySettingsForm repositoryId={repositoryId} bountySettings={bountySettings} />
    </div>
  );
}
