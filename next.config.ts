import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : "standalone",
  trailingSlash: isGithubPages,
  basePath: isGithubPages ? "/Morai" : "",
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isGithubPages,
  },
};

export default nextConfig;
