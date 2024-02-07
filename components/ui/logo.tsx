import Image from "next/image"
import Link from "next/link"

import OSSGGLogoDark from "../../app/oss-gg-logo-dark.png"
import OSSGGLogoLight from "../../app/oss-gg-logo.png"

export const Logo = ({ theme = "light" }) => {
  const logoSrc = theme === "dark" ? OSSGGLogoDark : OSSGGLogoLight

  return (
    <Link href="/" className="flex justify-center items-center">
      <Image src={logoSrc} alt="gamify open source contributions" width={120} />
    </Link>
  )
}
