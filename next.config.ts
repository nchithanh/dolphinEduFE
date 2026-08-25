import path from "node:path";
import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
/** Custom domain (Cloudflare) → site root. Project Pages fallback: /dolphinEduFE */
const basePath =
  isGithubPages && process.env.GITHUB_PAGES_BASE_PATH
    ? process.env.GITHUB_PAGES_BASE_PATH
    : "";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
      }
    : {}),
  turbopack: {
    root: path.join(__dirname),
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
