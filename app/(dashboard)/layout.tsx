import { DashboardNav } from "@/components/nav";
import { Logo } from "@/components/ui/logo";
import { UserAccountNav } from "@/components/user-account-nav";
import { dashboardConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";

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
      <div className="absolute right-4 top-6 z-40 sm:absolute sm:right-12 sm:top-10 sm:z-40 md:top-10">
        <Logo />
      </div>

      <aside className="fixed w-full flex-col justify-between bg-muted p-8 sm:h-screen sm:w-[250px] md:flex">
        <div>
          <div className="mb-4 ml-4 hidden sm:block">
            <UserAccountNav
              user={{
                name: user.name,
                avatarUrl: user.avatarUrl,
                email: user.email,
              }}
            />
          </div>
          <DashboardNav items={dashboardConfig.mainNav} userGitHubId={user.login} />
        </div>
        <div>
          {/*           <div className="mb-2">
            <ConnectGitHubAppButton
              appInstallationUrl={`https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`}
            />
          </div> */}
          <div className="hidden sm:block">
            <DashboardNav items={dashboardConfig.bottomNav} />
            <p className="mb-3 ml-3 mt-5  text-xs">
              <a href="https://github.com/formbricks/oss.gg">Built by the community</a>
            </p>
            <p className="ml-3 text-xs">
              <a href="https://formbricks.com/github">Powered by Formbricks</a>
            </p>
          </div>
        </div>
      </aside>
      <main className="mt-16 flex w-full flex-1 flex-col overflow-auto pb-8 pl-4 pr-4 pt-16 sm:ml-[250px] sm:p-12">
        {children}
      </main>
    </div>
  );
}
