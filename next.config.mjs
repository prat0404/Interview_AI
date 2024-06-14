/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      "images.unsplash.com",
      "firebasestorage.googleapis.com",
      "ik.imagekit.io",
      "unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  env: {
    NEXT_PHONEPE_SALT_KEY: process.env.NEXT_PHONEPE_SALT_KEY,
  },
};

export default nextConfig;

