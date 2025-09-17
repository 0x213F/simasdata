import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // No basePath needed for custom domain (simasdata.org)
  // basePath: isProd ? '/simasdata' : '',
  // assetPrefix: isProd ? '/simasdata' : '',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
