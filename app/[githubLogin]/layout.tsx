import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/session";

interface ProfileLayoutProps {
  children?: React.ReactNode;
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-[35vh] bg-gradient-to-br from-slate-950 to-slate-800">
        <header className="sticky top-0 z-40 mx-auto flex max-w-6xl justify-between px-8 py-6">
          <Logo />
          <Button href="/">What is oss.gg?</Button>
        </header>
      </div>
      <div className="">
        <main className="mx-auto flex min-h-[65vh] max-w-6xl flex-1 flex-col px-8">{children}</main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
