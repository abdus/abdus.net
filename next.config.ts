import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/snowbell",
        permanent: true,
        destination: "/projects/snowbell",
      },
    ];
  },
};

export default nextConfig;
