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
      <title>oss.gg - Gamify Open Source Contributions</title>
      <meta
        name="description"
        content="oss.gg is a community-driven platform to help facilitate more community contributions with less work for project maintainers."
      />
      <meta property="og:title" content="Gamify Open Source Contribution" />
      <meta
        property="og:description"
        content="oss.gg is a community-driven platform to help facilitate more community contributions with less work for project maintainers."
      />
      <meta name="image" content="../favicon.ico" />
      <meta property="og:image" content="<generated>" />
      <meta property="og:image:type" content="<generated>" />
      <meta property="og:image:width" content="<generated>" />
      <meta property="og:image:height" content="<generated>" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="canonical" href="https://oss.gg" />
      <meta property="og:image:alt" content="Gamify Open Source Contribution" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="oss.gg - Gamify Open Source Contributions" />
      <meta property="article:publisher" content="Formbricks GmbH" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@formbricks" />
      <meta name="twitter:creator" content="@formbricks" />
      <meta name="twitter:title" content="oss.gg - Gamify Open Source Contributions" />
      <meta
        name="twitter:description"
        content="oss.gg is a community-driven platform to help facilitate more community contributions with less work for project maintainers."
      />
      <meta
        name="keywords"
        content="Open Source Contributions, OSS Contributions, FOSS Contributions, COSS Contributions"
      />
      <meta name="theme-color" content="#00C4B8" />
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
