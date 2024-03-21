import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    { title: "Home", href: "/dashboard" },
    { title: "Open issues", href: "/issues" },
    { title: "Enroll to play", href: "/enroll" },
    { title: "Settings", href: "/settings" },
  ],
  bottomNav: [
    { title: "What is oss.gg?", href: "/", external: true },
    { title: "Help build oss.gg", href: "/contribute" },
  ],
};
