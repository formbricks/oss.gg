import { FileTextIcon, Settings2Icon } from "lucide-react";
import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Posts",
      href: "/dashboard",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
    },
  ],
};
