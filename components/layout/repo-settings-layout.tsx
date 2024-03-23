"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useContext, useMemo } from "react";

export default function NavTabs() {
  const pathname = usePathname();
  const { repositoryId } = useParams() as { repositoryId: string };

  const tabs = [
    { name: "Players", href: `/repo-setting/${repositoryId}` },
    { name: "Project Description", href: `/repo-setting/${repositoryId}/project-description` },
    { name: "Levels Settings", href: `/repo-setting/${repositoryId}/levels` },
    { name: "Email Content", href: `/repo-setting/${repositoryId}/emails` },
    { name: "Bounty Settings", href: `/repo-setting/${repositoryId}/bounty-setting` },
  ];

  return (
    <div className="scrollbar-hide mb-[-3px] flex h-12 w-fit items-center justify-start space-x-2 overflow-x-auto rounded-lg bg-zinc-100 px-3">
      {tabs.map(({ name, href }) => (
        <Link key={href} href={href} className="relative">
          <div
            className={cn(
              "m-1 rounded-md px-3 py-2 transition-all duration-75 hover:bg-white active:bg-white",
              (pathname === href || (href.endsWith("/Bounty Settings") && pathname?.startsWith(href))) &&
                "bg-white"
            )}>
            <p className="text-sm text-gray-600 hover:text-black">{name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
