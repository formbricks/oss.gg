import { DashboardConfig } from "types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    { title: "Open issues", href: "/issues" },
    { title: "Enroll to play", href: "/enroll" },
    { title: "Your profile", href: "/", external: true },
  ],
  bottomNav: [
    { title: "What is oss.gg?", href: "/", external: true },
    { title: "Help build oss.gg", href: "/contribute" },
  ],
};
