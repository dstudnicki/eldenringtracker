/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https", // or http
                hostname: "eldenring.fanapis.com",
            },
            {
                protocol: "https", // or http
                hostname: "scdn.veryfi.com",
            },
        ],
    },
};

export default nextConfig;
