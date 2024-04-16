"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BottomNavItem } from "types";

interface DashboardNavProps {
  items: BottomNavItem[];
  userGitHubId?: string;
}

export function DashboardNav({ items, userGitHubId }: DashboardNavProps) {
  const path = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (!items?.length) {
    return null;
  }

  return (
    <div>
       <div className="flex sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-text-primary hover:text-text-secondary text-xl focus:outline-none"
            >
            &#9776;
          </button>
        </div>
      <nav className={`grid items-start gap-2 ${menuOpen ? 'pt-4' : 'max-[640px]:hidden'} sm:grid-cols-1`}>
      {items.map((item, index) => {
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : item.href}>
              <span
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}>
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
      {userGitHubId && (
        <Link key={userGitHubId} href={`/${userGitHubId}`} target="_blank">
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            )}>
            <span>Your profile</span>
          </span>
        </Link>
      )}
    </nav>
    </div>
  );
}
