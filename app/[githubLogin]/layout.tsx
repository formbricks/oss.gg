"use server";

import { SiteFooter } from "@/components/site-footer";

interface ProfileLayoutProps {
  children?: React.ReactNode;
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4">
      <header />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
