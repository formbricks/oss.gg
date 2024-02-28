"use client";

import { Button } from "@/components/ui/button";

export default function ConnectGitHubAppButton() {
  const handleRedirect = () => {
    window.location.href = "https://github.com/apps/oss-gg-test-app/installations/new";
  };

  return (
    <Button onClick={handleRedirect} className="w-full">
      Connect Repo
    </Button>
  );
}
