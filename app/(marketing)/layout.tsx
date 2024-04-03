import { SiteFooter } from "@/components/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

// create a simple object for top nav

const topNav = [
  {
    name: "Founding Members",
    href: "/founding-team",
    outbound: false,
  },
  {
    name: "GitHub",
    href: "/github",
    outbound: true,
  },
  {
    name: "Figma",
    href: "/figma",
    outbound: true,
  },
  {
    name: "Discord",
    href: "/discord",
    outbound: true,
  },
];

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
      <meta property="og:image" content="https://oss.gg/opengraph-image.png?twittersucks" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="120" />
      <meta property="og:image:height" content="630" />
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
        <nav className="grid grid-cols-1 sm:flex sm:h-20 sm:items-center gap-4 justify-between py-6 px-4 sm:px-6 lg:px-8 flex">
            <Logo />
            <ul className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-end gap-4 mt-4 sm:mt-0 sm:col-span-2">
              {topNav.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target={item.outbound ? "_blank" : undefined}
                    className="text-text-primary hover:text-text-secondary text-sm font-medium text-muted-foreground hover:text-foreground">
                    {item.name}
                    {item.outbound && <ArrowUpRight size={16} className="ml-1 inline" />}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "px-4 mt-4 sm:mt-0")}>
              Let&apos;s play
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
