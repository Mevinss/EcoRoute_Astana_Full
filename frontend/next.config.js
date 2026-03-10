/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API requests to backend (works in Codespaces)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:4000/api/:path*',
      },
    ];
  },
  
  // MapLibre GL transpilation
  transpilePackages: ['maplibre-gl'],
  
  // Webpack configuration for MapLibre
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;
