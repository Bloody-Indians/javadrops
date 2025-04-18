/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export', // ❌ Commented out to allow API routes
  basePath: '/javadrops',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig
