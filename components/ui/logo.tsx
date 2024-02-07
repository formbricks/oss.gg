import Image from "next/image";
import Link from "next/link";

import OSSLogoDark from "../../app/oss-gg-logo-dark.png";

export const Logo = () => {
  /*   const { resolvedTheme } = useTheme();
  let src;

  switch (resolvedTheme) {
    case "light":
      src = "../../app/oss-gg-logo.png";
      break;
    case "dark":
      src = "../../app/oss-gg-logo-dark.png";
      break;
    default:
      src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      break;
  } */
  return (
    <Link href="/" className="flex items-center justify-center">
      <Image alt="oss.gg logo" src={OSSLogoDark} width={120} />
    </Link>
  );
};
