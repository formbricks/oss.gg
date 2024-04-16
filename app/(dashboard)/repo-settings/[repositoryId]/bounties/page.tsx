import { BountySettingsForm } from "@/components/forms/bounty-form";

export const metadata = {
  title: "Bounty settings",
  description: "Control how bounties are given out incl. thresholds.",
};

export default function BountySettings() {
  return (
    <div>
      <BountySettingsForm />
    </div>
  );
}
