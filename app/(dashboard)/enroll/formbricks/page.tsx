import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import FB1 from "./fb-view-1.webp";
import FB2 from "./fb-view-2.webp";

export const metadata = {
  title: "Formbricks",
  description: "Contribute to the worlds fastest growing survey infrastructure.",
};

const FrombricksFeatures = [
  {
    icon: "📲",
    description: "Create conversion-optimized surveys with our no-code editor with several question types.",
  },
  {
    icon: "📚",
    description: "Choose from a variety of best-practice templates.",
  },
  {
    icon: "👩🏻",
    description:
      "Launch and target your surveys to specific user groups without changing your application code.",
  },
  {
    icon: "🔗",
    description: "Create shareable link surveys.",
  },
  {
    icon: "👨‍👩‍👦",
    description: "Invite your team members to collaborate on your surveys.",
  },
  {
    icon: "🔌",
    description: "Integrate Formbricks with Slack, Notion, Zapier, n8n, and more.",
  },
  {
    icon: "🔒",
    description: "All open source, transparent, and self-hostable.",
  },
];

const FormbricksTechStack = [
  {
    icon: "💻",
    name: "Typescript",
    href: "https://www.typescriptlang.org/",
  },
  {
    icon: "🚀",
    name: "Next.js",
    href: "https://nextjs.org/",
  },
  {
    icon: "⚛️",
    name: "React",
    href: "https://reactjs.org/",
  },
  {
    icon: "🎨",
    name: "TailwindCSS",
    href: "https://tailwindcss.com/",
  },
  {
    icon: "📚",
    name: "Prisma",
    href: "https://www.prisma.io/",
  },
  {
    icon: "🔒",
    name: "Auth.js",
    href: "https://auth0.com/", // Assuming Auth.js refers to Auth0, adjust if needed
  },
  {
    icon: "🧘‍♂️",
    name: "Zod",
    href: "https://github.com/colinhacks/zod", // Zod's documentation is often hosted on GitHub
  },
];

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Formbricks"
        text="Contribute to the worlds fastest growing survey infrastructure."
      />
      <div className="flex justify-end rounded-md bg-muted p-4">
        <Button size={"sm"}>Enroll to play</Button>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <Image src={FB1} alt="formbricks open source survey infrastructure" className="rounded-md" />
        <Image src={FB2} alt="formbricks open source survey infrastructure" className="rounded-md" />
      </div>
      <div className="space-y-4">
        <h2 className=" text-xl font-medium">About Formbricks</h2>
        <p>
          Formbricks provides a free and open source surveying platform. Gather feedback at every point in the
          user journey with beautiful in-app, website, link and email surveys. Build on top of Formbricks or
          leverage prebuilt data analysis capabilities.{" "}
        </p>
        <hr />
        <h2 className="text-xl font-medium">Features</h2>
        <ul>
          {FrombricksFeatures.map((feature, index) => (
            <li key={index}>
              {feature.icon} {feature.description}
            </li>
          ))}
        </ul>
        <hr />
        <h2 className="text-xl font-medium">Tech Stack</h2>
        <ul>
          {FormbricksTechStack.map((tech, index) => (
            <li key={index}>
              <Link href={tech.href} target="_blank" rel="noopener noreferrer">
                {tech.icon} {tech.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </DashboardShell>
  );
}
