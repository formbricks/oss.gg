import { SiteFooter } from "@/components/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { MoveDown } from "lucide-react";
import Link from "next/link";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div>
      <div className="group relative flex h-screen flex-col items-center justify-center bg-[radial-gradient(_var(--tw-gradient-stops))] from-slate-900 to-black">
        <h2 className="font-heading mb-6 text-7xl">🕹️</h2>
        <Link
          href="/login"
          className="rounded-md bg-slate-50 px-8 py-3 font-medium text-slate-900 hover:bg-slate-200">
          Let&apos;s play
        </Link>
        <p className="absolute bottom-5 flex gap-x-1 text-xs text-slate-400 opacity-0 transition-all duration-500 group-hover:opacity-100">
          Find out more <MoveDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} />
        </p>
      </div>

      <div className="flex min-h-screen flex-col">
        <header className="container z-40 bg-background">
          <div className="flex h-20 items-center justify-between py-6">
            <Logo />
            <nav>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "px-4")}>
                Login
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
