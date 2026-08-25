import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isolate from sibling Ops FE / monorepo lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
