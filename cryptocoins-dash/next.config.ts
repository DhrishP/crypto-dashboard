import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "static.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "static.coindesk.com",
      },
      {
        protocol: "https",
        hostname: "images.cointelegraph.com",
      },
      {
        protocol: "https",
        hostname: "image.cnbcfm.com",
      },
    ],
  }
};

export default nextConfig;
