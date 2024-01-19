import Link from "next/link";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Building2,
  CircleDollarSign,
  Medal,
  MessageCircleCode,
  Pointer,
  Shirt,
} from "lucide-react";

async function getGitHubStars(): Promise<string | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/formbricks/oss.gg",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${env.GITHUB_ACCESS_TOKEN}`,
        },
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response?.ok) {
      return null;
    }

    const json = await response.json();

    return parseInt(json["stargazers_count"]).toLocaleString();
  } catch (error) {
    return null;
  }
}

export default async function IndexPage() {
  const stars = await getGitHubStars();

  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href={siteConfig.links.twitter}
            className="bg-muted rounded-2xl px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Follow along on Twitter
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Gamify Open Source Contributions
          </h1>
          <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
            Celebrating remarkable contributions, our ranking system that aims
            to recognize and honor outstanding contributors within the open
            source community.
          </p>
          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 md:py-12 lg:py-24 dark:bg-transparent"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
            Gamify Open Source
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Medal className="size-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Ranking System</h3>
                <p className="text-muted-foreground text-sm">
                  Make contributions, earn points and level up.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <CircleDollarSign className="size-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Bounties</h3>
                <p className="text-sm">
                  Get paid for your contributions with bounties.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Shirt className="size-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Swag</h3>
                <p className="text-muted-foreground text-sm">
                  Earn swag for your contributions.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Pointer className="size-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Choose your project</h3>
                <p className="text-muted-foreground text-sm">
                  Choose from a list of projects to contribute to.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <MessageCircleCode className="size-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Brag</h3>
                <p className="text-muted-foreground text-sm">
                  Brag about your contributions on your profile.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Building2 className="size-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Land a job</h3>
                <p className="text-muted-foreground text-sm">
                  Get noticed by companies for your contributions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Proudly Open Source
          </h2>
          <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
            oss.gg is open source and powered by open source software. <br />{" "}
            The code is available on{" "}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </Link>
            .{" "}
          </p>
          {stars && (
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex"
            >
              <div className="border-muted bg-muted flex size-10 items-center justify-center space-x-2 rounded-md border">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="text-foreground size-5"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="border-muted size-4 border-y-8 border-l-0 border-r-8 border-solid border-y-transparent"></div>
                <div className="border-muted bg-muted flex h-10 items-center rounded-md border px-4 font-medium">
                  {stars} stars on GitHub
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
