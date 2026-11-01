import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Snowbell was retired in November 2026.
      { source: "/snowbell", destination: "/projects", permanent: true },
      { source: "/projects/snowbell", destination: "/projects", permanent: true },
    ];
  },
};

export default nextConfig;
