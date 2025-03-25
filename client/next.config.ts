import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow specific origins for development
  experimental: {
    allowedDevOrigins: [
      "redbird-large-macaque.ngrok-free.app", // Your ngrok domain
      "localhost",
      "127.0.0.1",
    ],
  },

  // Optional: Add CORS headers for API routes
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
