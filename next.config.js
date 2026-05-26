/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['anthropic']
  }
}
module.exports = nextConfig
