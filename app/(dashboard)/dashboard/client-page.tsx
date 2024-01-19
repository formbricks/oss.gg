"use client"

import { Button } from "@/components/ui/button"

export default function ConnectGitHubAppButton() {
  console.log("ConnectGitHubAppButton")

  const handleRedirect = () => {
    window.location.href =
      "https://github.com/apps/ossgg-test/installations/new"
  }

  return <Button onClick={handleRedirect}>connect repository to oss.gg</Button>
}
