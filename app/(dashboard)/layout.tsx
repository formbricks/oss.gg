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
      <div className="absolute top-10 z-40 sm:absolute sm:right-12 sm:top-10 sm:z-40 right-4">
        <Logo />
      </div>

      <aside className="fixed pt-12 sm:pt-0 sm:hidden sm:h-screen w-full sm:w-[250px] flex-col justify-between bg-muted p-8 md:flex">
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
      <main className="sm:ml-[250px] mt-16 flex w-full flex-1 flex-col overflow-auto sm:p-12 pt-16 pr-4 pl-4 pb-8">{children}</main>
    </div>
  );
}
