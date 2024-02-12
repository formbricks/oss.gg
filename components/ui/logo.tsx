"use client";

import OSSLogoDark from "@/public/oss-gg-logo-dark.png";
import OSSLogoLight from "@/public/oss-gg-logo.png";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  const { resolvedTheme } = useTheme();
  let src = resolvedTheme === "dark" ? OSSLogoDark : OSSLogoLight;

  return (
    <Link href="/">
      <Image alt="oss.gg logo" src={src} width={120} height={60} />
    </Link>
  );
};
