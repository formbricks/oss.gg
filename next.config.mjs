import "./env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    serverComponentsExternalPackages: ["@aws-sdk"],
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/WmH2ymxeuG",
        permanent: true,
      },
      {
        source: "/marketing",
        destination: "/",
        permanent: true,
      },
      {
        source: "/marketing/founding-team",
        destination: "/",
        permanent: false,
      },
      {
        source: "/issues",
        destination: "/oss-issues",
        permanent: false,
      },
      {
        source: "/github",
        destination: "https://github.com/formbricks/oss.gg",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
