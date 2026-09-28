/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  output: 'export',
  basePath: isProd ? '/sih26_skyfusion' : '',
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    return config;
  },
};

export default nextConfig;
