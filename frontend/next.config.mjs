/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'be-1-yqrf.onrender.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
