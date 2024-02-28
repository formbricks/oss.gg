"use client";

import { Button } from "@/components/ui/button";

export default function ConnectGitHubAppButton({ appInstallationUrl }: { appInstallationUrl: string }) {
  const handleRedirect = () => {
    window.location.href = appInstallationUrl;
  };

  return (
    <Button onClick={handleRedirect} className="w-full">
      Connect Repo
    </Button>
  );
}
