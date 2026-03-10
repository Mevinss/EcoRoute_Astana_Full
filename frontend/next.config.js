/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API requests to backend.
  // In Docker: BACKEND_URL=http://backend:4000 (service name)
  // Locally:   BACKEND_URL=http://localhost:4000 (default)
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
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
