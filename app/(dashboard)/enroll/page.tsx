import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { TRepository } from "@/types/repository";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAllRepositoriesAction } from "../actions";

export const metadata = {
  title: "Enroll to play",
  description: "Choose open source projects you want to contribute to - and gather points!",
};

export default async function EnrollPage() {
  const user = await getCurrentUser();
  const repositoryResult = await getAllRepositoriesAction();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  if ("error" in repositoryResult) {
    console.error(repositoryResult.error);
    return <div>Error: {repositoryResult.error}</div>;
  }

  const repos: TRepository[] = repositoryResult;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Enroll to play"
        text="Choose open source projects you want to contribute to - and gather points!"
      />
      <div className="space-y-4">
        {repos && (
          <div>
            {repos.map((project) => (
              <Link
                href={`/enroll/${project.id}`}
                key={project.githubId}
                className="my-3 flex justify-between space-x-5 rounded-md border border-transparent bg-muted p-6 transition-all duration-150 ease-in-out hover:scale-102 hover:cursor-pointer">
                <div className="flex items-center space-x-5">
                  <Image
                    className="rounded-md"
                    src="https://avatars.githubusercontent.com/u/105877416?s=200&v=4"
                    alt={project.name}
                    width={80}
                    height={80}
                  />
                  <div>
                    <p className="text-xl font-medium">{project.name}</p>
                    <p className="my-1 text-sm">{project.description}</p>
                    <div className="mt-1 flex space-x-1 text-xs">
                      <div className="mt-1 rounded-full bg-accent px-2 py-1">5k ⭐</div>
                      {/*  <div className="rounded-full bg-accent px-2 py-1">{project.bountiesPaid} ✅</div>
                  <div className="rounded-full bg-accent px-2 py-1">{project.bountiesOpen} 💰</div> */}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-md border border-accent pb-8 pt-10">
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
