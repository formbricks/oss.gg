"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RefreshRepoButton() {
  const router = useRouter();

  const refreshPage = () => {
    router.refresh();
  };

  return (
    <Button onClick={refreshPage} className="ml-auto w-fit">
      Refresh Repositories
    </Button>
  );
}
