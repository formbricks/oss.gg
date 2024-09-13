"use server";

import { SiteFooter } from "@/components/site-footer";

interface ProfileLayoutProps {
  children?: React.ReactNode;
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {

  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-[35vh] bg-gradient-to-br from-zinc-950 to-zinc-800"></div>
      <div className="">
        <main className="mx-auto mb-24 flex min-h-[65vh] max-w-6xl flex-1 flex-col px-8">{children}</main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
