/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eldenring.fanapis.com",
      },
      {
        protocol: "https",
        hostname: "scdn.veryfi.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Prevent MIME-type sniffing
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer", // Restrict referrer data
          },
        ],
      },
    ];
  },
};

export default nextConfig;
