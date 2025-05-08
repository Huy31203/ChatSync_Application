/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === 'production' ? './out' : '.next',
  trailingSlash: true,
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/storage/file/**',
      },
    ],
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
        child_process: false,
      },
    };

    return config;
  },
  output: 'standalone',
};

module.exports = nextConfig;
