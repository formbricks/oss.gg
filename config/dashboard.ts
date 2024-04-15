import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Open issues", href: "/issues" },
    { title: "Repositories", href: "/enroll" },
    { title: "Settings", href: "/settings" },
  ],
  bottomNav: [
    { title: "What is oss.gg?", href: "/", external: true },
    { title: "Help build oss.gg", href: "/contribute" },
  ],
};
