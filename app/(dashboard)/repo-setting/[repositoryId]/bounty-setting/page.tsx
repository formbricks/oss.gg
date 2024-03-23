import { BountySettingsForm } from "@/components/forms/bounty-form";

export const metadata = {
  title: "Project description settings",
  description: "set up project description settings for your repo and community",
};

export default function BountySettings() {
  return (
    <div>
    <BountySettingsForm/>
    </div>
  );
}