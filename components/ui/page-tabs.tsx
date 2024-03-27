"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "./button";

export type PageTabsProps = {
  tabs: {
    label: string;
    href: string;
  }[];
  className?: string;
};

export function PageTabs({ tabs, className }: PageTabsProps) {
  const pathName = usePathname();

  return (
    <div className={cn(`flex w-fit flex-row rounded-lg bg-muted p-1`, className)}>
      {tabs.map((tab, index) => (
        <Button
          asChild
          size="sm"
          variant="secondary"
          className={cn(
            pathName === tab.href ? "bg-background text-primary hover:bg-background" : "text-muted-foreground"
          )}>
          <Link key={index} href={tab.href} className={cn("group flex flex-col items-center")}>
            {tab.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
