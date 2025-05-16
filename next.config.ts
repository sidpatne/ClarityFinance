import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Server Actions are enabled by default in Next.js 14+ with the App Router.
    // Explicitly enabling it here for clarity or older versions if needed.
    // serverActions: true, // This line might be redundant depending on Next.js version
  },
};

export default nextConfig;
