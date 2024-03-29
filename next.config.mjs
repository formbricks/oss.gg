import "./env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com", "pbs.twimg.com"],
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
        source: "/figma",
        destination:
          "https://www.figma.com/file/usCYaOpv13zMpvjEVc5z0Z/oss.gg-web-app?type=design&node-id=0%3A1&mode=design&t=DnQbQCeApQQoXDbT-1",
        permanent: true,
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
