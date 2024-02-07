import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Enroll to play",
  description: "Choose open source projects you want to contribute to - and gather points!",
};

const dummyProjects = [
  {
    logoHref: "https://avatars.githubusercontent.com/u/105877416?s=200&v=4",
    name: "Formbricks",
    id: "formbricks",
    description: "The Open Source Survey Toolbox",
    stars: "4832",
    bountiesOpen: "1443",
    bountiesPaid: "15234",
    key: "0",
  },
  {
    logoHref: "https://avatars.githubusercontent.com/u/79145102?s=200&v=4",
    name: "Cal.com",
    id: "calcom",
    description: "Scheduling Infrastructure for Everyone",
    stars: "26832",
    bountiesOpen: "11443",
    bountiesPaid: "45234",
    key: "1",
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
        heading="Enroll to play"
        text="Choose open source projects you want to contribute to - and gather points!"
      />
      <div className="space-y-4">
        {dummyProjects.map((project) => (
          <Link
            href={`/enroll/${project.id}`}
            key={project.key}
            className="flex justify-between space-x-5 rounded-md border border-transparent bg-slate-50 p-6 transition-all hover:border-slate-200 hover:bg-slate-100">
            <div className="flex items-center space-x-5">
              <Image
                className="rounded-md"
                src={project.logoHref}
                alt={project.name}
                width={80}
                height={80}
              />
              <div>
                <p className="text-xl font-medium">{project.name}</p>
                <p className="my-1 text-sm">{project.description}</p>
                <div className="mt-1 flex space-x-1 text-xs">
                  <div className="rounded-full bg-white px-2 py-1">{project.stars} ⭐</div>
                  <div className="rounded-full bg-white px-2 py-1">{project.bountiesPaid} ✅</div>
                  <div className="rounded-full bg-white px-2 py-1">{project.bountiesOpen} 💰</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-md border border-slate-200 pb-8 pt-10">
          <p>You run an OSS project and want to be part of oss.gg?</p>
          <Button
            href="https://app.formbricks.com/s/clrl910rrevx31225b389v4pw"
            variant="outline"
            openInNewTab>
            Request Onboarding
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
