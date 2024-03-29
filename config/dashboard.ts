import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    { title: "Open issues", href: "/issues" },
    { title: "Repositories", href: "/enroll" },
  ],
  bottomNav: [
    /*     { title: "Repo Settings", href: "/manage-repos" }, */
    { title: "What is oss.gg?", href: "/", external: true },
    { title: "Help build oss.gg", href: "/contribute" },
  ],
};
