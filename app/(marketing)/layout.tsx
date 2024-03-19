import { SiteFooter } from "@/components/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div>
      <div className="flex min-h-screen flex-col">
        <header className="container z-40 bg-background">
          <div className="flex h-20 items-center justify-between py-6">
            <Logo />
            <nav>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "px-4")}>
                Let&apos;s play
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
