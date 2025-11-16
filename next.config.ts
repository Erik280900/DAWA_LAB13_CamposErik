import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
            {
                hostname: 'avatars.githubusercontent.com',
            },
            // Si usas Google, también puedes necesitar 'lh3.googleusercontent.com'
            {
                hostname: 'lh3.googleusercontent.com',
            },
        ],
  }
};

export default nextConfig;
