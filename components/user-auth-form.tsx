"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import * as React from "react";
import { FaGithub } from "react-icons/fa";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGitHubLoading(true);
          signIn("github");
        }}
        disabled={isGitHubLoading}>
        {isGitHubLoading ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <FaGithub className="mr-2 size-4" />
        )}
        Github
      </button>
    </div>
  );
}
