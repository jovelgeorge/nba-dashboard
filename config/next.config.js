const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@config': path.join(__dirname, '../config'),
    };
    
    return config;
  },
};

module.exports = nextConfig;