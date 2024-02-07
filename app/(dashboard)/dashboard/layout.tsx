import { DashboardNav } from "@/components/nav";
import { UserAccountNav } from "@/components/user-account-nav";
import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import OSSGGLogo from "../oss-gg-logo.png";
import ConnectGitHubAppButton from "./client-page";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <div className="relative flex min-h-screen">
      <Link href="/" className="absolute right-12 top-10 z-40">
        <Image src={OSSGGLogo} alt="oss gg logo" width={160} />
      </Link>
      <aside className="hidden w-[250px] flex-col justify-between bg-slate-200 p-8 md:flex">
        <div>
          <div className="mb-4 ml-4">
            <UserAccountNav
              user={{
                name: user.name,
                avatarUrl: user.avatarUrl,
                email: user.email,
              }}
            />
          </div>
          <DashboardNav items={dashboardConfig.mainNav} />
        </div>
        <div>
          <div className="mb-2">
            <ConnectGitHubAppButton />
          </div>
          <DashboardNav items={dashboardConfig.bottomNav} />
          <p className="mb-3 ml-3 mt-5 text-xs">
            <a href="https://formbricks.com/github">Built by Formbricks</a>
          </p>
          <p className="ml-3 text-xs">
            <a href="https://github.com/formbricks/oss.gg">View Source Code</a>
          </p>
        </div>
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-auto p-12">{children}</main>
    </div>
  );
}
