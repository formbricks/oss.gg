import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div>
      <div className="h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center flex-col">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-6">
          🕹️
        </h2>
        <div>
          <Link
            href="/login"
            className="px-8 py-3 bg-slate-50 text-slate-900 rounded-md font-medium"
          >
            Let's play
          </Link>
        </div>
      </div>
      <div className="flex min-h-screen flex-col">
        <header className="container z-40 bg-background">
          <div className="flex h-20 items-center justify-between py-6">
            <MainNav items={marketingConfig.mainNav} />
            <nav>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                Login
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}
