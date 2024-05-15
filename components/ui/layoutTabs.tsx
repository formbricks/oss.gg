"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LayoutTabsProps {
  tabsData: {
    href: string;
    value: string;
    label: string;
  }[];
  tabNumberInUrlPathSegment: number;
  defaultTab: string;
}

export default function LayoutTabs({ tabsData, tabNumberInUrlPathSegment, defaultTab }: LayoutTabsProps) {
  const path = usePathname();
  const activeTab = path?.split("/")[tabNumberInUrlPathSegment] || defaultTab;

  return (
    <Tabs defaultValue={`${activeTab}`} className="w-full">
      <TabsList>
        {tabsData.map((tab, index) => (
          <Link key={index} href={tab.href} className="max-[640px]:w-full">
            <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
}
