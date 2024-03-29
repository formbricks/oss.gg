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
      <div className="absolute right-12 top-10 z-40">
        <Logo />
      </div>

      <aside className="fixed hidden h-screen w-[250px] flex-col justify-between bg-muted p-8 md:flex">
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
          <DashboardNav items={dashboardConfig.mainNav} userGitHubId={user.login} />
        </div>
        <div>
          {/*           <div className="mb-2">
            <ConnectGitHubAppButton
              appInstallationUrl={`https://github.com/apps/${GITHUB_APP_SLUG}/installations/new`}
            />
          </div> */}
          <DashboardNav items={dashboardConfig.bottomNav} />
          <p className="mb-3 ml-3 mt-5  text-xs">
            <a href="https://github.com/formbricks/oss.gg">Built by the community</a>
          </p>
          <p className="ml-3 text-xs">
            <a href="https://formbricks.com/github">Powered by Formbricks</a>
          </p>
        </div>
      </aside>
      <main className="ml-[250px] flex w-full flex-1 flex-col overflow-auto p-12">{children}</main>
    </div>
  );
}
