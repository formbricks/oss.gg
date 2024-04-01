import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    { title: "Home", href: "/dashboard" },
    { title: "Open issues", href: "/issues" },
    { title: "Repositories", href: "/enroll" },
    { title: "Settings", href: "/settings" },
  ],
  bottomNav: [
    /*     { title: "Repo Settings", href: "/manage-repos" }, */
    { title: "What is oss.gg?", href: "/", external: true },
    { title: "Help build oss.gg", href: "/contribute" },
  ],
};
