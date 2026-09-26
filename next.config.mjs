/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  output: 'export',
  basePath: isGithubActions ? '/sih26_skyfusion' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
