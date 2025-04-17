/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/javadrops',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig