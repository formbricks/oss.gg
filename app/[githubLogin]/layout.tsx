"use server";

import { SiteFooter } from "@/components/site-footer";
import { getCurrentUser } from "@/lib/session";
import OSSGGLogoDark from "@/public/oss-gg-logo-dark.png";
import Image from "next/image";
import Link from "next/link";

interface ProfileLayoutProps {
  children?: React.ReactNode;
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-[35vh] bg-gradient-to-br from-zinc-950 to-zinc-800">
        <header className="sticky top-0 z-40 mx-auto flex max-w-6xl justify-between px-8 py-6">
          <Link href="/">
            <Image src={OSSGGLogoDark} alt="oss gg logo" width={120} />
          </Link>
        </header>
      </div>
      <div className="">
        <main className="mx-auto mb-24 flex min-h-[65vh] max-w-6xl flex-1 flex-col px-8">{children}</main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
