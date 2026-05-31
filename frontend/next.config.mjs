/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'favorite-photo.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'favorite-photo-red.vercel.app',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
