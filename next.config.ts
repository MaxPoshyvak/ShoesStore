import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Це дозволить всі картинки, для старту ок
      },
    ],
  },
};

export default nextConfig;
