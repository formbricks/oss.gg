import Image from "next/image";
import Link from "next/link";

import OSSGGLogoDark from "../../app/oss-gg-logo-dark.png";
import OSSGGLogoLight from "../../app/oss-gg-logo.png";

export const Logo = ({ theme = "light" }) => {
  const logoSrc = theme === "dark" ? OSSGGLogoDark : OSSGGLogoLight;

  return (
    <Link href="/" className="flex items-center justify-center">
      <Image
        src={OSSGGLogoLight}
        alt="gamify open source contributions"
        className="hidden dark:block"
        width={120}
      />
      <Image src={OSSGGLogoDark} alt="gamify open source contributions" className="dark:hidden" width={120} />
    </Link>
  );
};
