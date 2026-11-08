/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (isServer) config.externals.push({ 'node:sqlite': 'commonjs node:sqlite' });
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ]
  },
  experimental: {
    typedRoutes: false
  }
};

// El servidor de desarrollo y el build no deben sobrescribir sus artefactos.
export default (phase) => ({
  ...nextConfig,
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next'
});
