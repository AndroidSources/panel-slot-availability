/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  agentRules: false,
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: isGithubPages ? "/panel-slot-availability" : undefined,
  assetPrefix: isGithubPages ? "/panel-slot-availability/" : undefined,
};

export default nextConfig;
