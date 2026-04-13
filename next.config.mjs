/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Abstract-Server-Web',
  assetPrefix: '/Abstract-Server-Web/',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
