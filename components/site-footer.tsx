import { ModeToggle } from "@/components/mode-toggle";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 font-mono text-xs md:h-12 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center leading-loose md:text-left">
            Built by{" "}
            <Link
              href="https://formbricks.com/github"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4">
              Formbricks
            </Link>
            . The source code of oss.gg is available on{" "}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4">
              GitHub
            </Link>
            .
          </p>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
