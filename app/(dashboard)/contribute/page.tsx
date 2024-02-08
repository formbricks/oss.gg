import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import { redirect } from "next/navigation";

import OSSGGTribe from "./ossgg-tribe.webp";

export const metadata = {
  title: "Contribute to oss.gg",
  description: "Help us make oss.gg the most fun way to run open-source communities.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Contribute to oss.gg"
        text="Help us make oss.gg the most fun way to run open-source communities."
      />
      <Image
        src={OSSGGTribe}
        alt="formbricks open source survey infrastructure"
        className="max-w-3xl rounded-lg"
      />
      <p>
        oss.gg is from the open source community for the open source community. While it has been started by
        Formbricks, we want to involve as many community members in the development as possible.
      </p>
      <p>We need:</p>
      <ul className="ml-3 list-disc">
        <li>Designers</li>
        <li>Community Moderators</li>
        <li>Engineers</li>
        <li>Product Managers</li>
        <li>Content Writers</li>
        <li>and whatever you want to bring to the table :)</li>
      </ul>
      <div>
        <Button size={"sm"} href="https://oss.gg/discord ">
          Join oss.gg Discord
        </Button>
      </div>
    </DashboardShell>
  );
}
