import DeleteAccountCard from "@/components/delete-account-card";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const metadata = {
  title: "Settings",
  description: "Your account settings",
};

const emailSettingItems = [
  {
    id: 1,
    label: "Get Email for moments of celebration",
    description: "We'll send you an email when you level up or earn a badge.",
  },
  {
    id: 2,
    label: "Get Email for new projects",
    description: "We'll send you an email when a new project is added that matches your interests.",
  },
];

export default async function SettingsPage() {
  const handleDeleteAccount = () => {
    console.log("Deleting account");
  };
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Your account settings" />
      <div className="h-fit w-full space-y-3 rounded-lg bg-zinc-50 p-5 ">
        <p className="text-md font-bold">Email Settings </p>
        {emailSettingItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox id={item.label} />
            <label
              htmlFor={item.label}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {item.label}
            </label>
          </div>
        ))}
      </div>
      <DeleteAccountCard />
    </DashboardShell>
  );
}
