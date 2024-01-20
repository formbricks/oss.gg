import nextMDX from "@next/mdx"

import "./env.mjs"

const withMDX = nextMDX({
  extension: /\.mdx?$/,
})

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/WmH2ymxeuG",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/formbricks/oss.gg",
        permanent: true,
      },
    ]
  },
}

export default withMDX({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  ...nextConfig,
})
