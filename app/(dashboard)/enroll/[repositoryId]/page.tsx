import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";

import EnrollmentStatusBar from "./enrollmentStatusBar";
import FB1 from "./fb-view-1.webp";
import FB2 from "./fb-view-2.webp";

const frombricksFeatures = [
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

const formbricksTechStack = [
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
    href: "https://auth0.com/",
  },
  {
    icon: "🧘‍♂️",
    name: "Zod",
    href: "https://github.com/colinhacks/zod",
  },
];

export default function RepositoryDetailPage({ params }) {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Formbricks"
        text="Contribute to the worlds fastest growing survey infrastructure."
      />
      <EnrollmentStatusBar repositoryId={params.repositoryId} />
      <Tabs defaultValue="project-details" className="w-full">
        <TabsList>
          <TabsTrigger value="project-details">Project Details</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="open-issues">Open Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="project-details">
          <ProjectDetailsSection />
        </TabsContent>
        <TabsContent value="leaderboard">Coming soon: A new adventure awaits!</TabsContent>
        <TabsContent value="open-issues">Coming soon: A new adventure awaits!</TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

function ProjectDetailsSection() {
  return (
    <>
      <div className="grid gap-2 md:grid-cols-2">
        <Image src={FB1} alt="Formbricks open source survey infrastructure" className="rounded-md" />
        <Image src={FB2} alt="Formbricks open source survey infrastructure" className="rounded-md" />
      </div>
      <div className="space-y-4">
        <Section
          title="About Formbricks"
          content="Formbricks provides a free and open source surveying platform. Gather feedback at every point in the user journey with beautiful in-app, website, link and email surveys. Build on top of Formbricks or leverage prebuilt data analysis capabilities."
        />
        <FeaturesSection title="Features" features={frombricksFeatures} />
        <TechStackSection title="Tech Stack" techStack={formbricksTechStack} />
      </div>
    </>
  );
}

function Section({ title, content }) {
  return (
    <>
      <h2 className="text-xl font-medium">{title}</h2>
      <p>{content}</p>
      <hr />
    </>
  );
}

function FeaturesSection({ title, features }) {
  return (
    <>
      <h2 className="text-xl font-medium">{title}</h2>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>
            {feature.icon} {feature.description}
          </li>
        ))}
      </ul>
      <hr />
    </>
  );
}

function TechStackSection({ title, techStack }) {
  return (
    <>
      <h2 className="text-xl font-medium">{title}</h2>
      <ul>
        {techStack.map((tech, index) => (
          <li key={index}>
            <Link href={tech.href} target="_blank" rel="noopener noreferrer">
              {tech.icon} {tech.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
