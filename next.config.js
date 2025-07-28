// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     appDir: true
//   }
// }
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for MongoDB compatibility
  experimental: {
    serverActions: {},
    optimizePackageImports: ['pdf-parse'],
    // New format for external packages
    serverExternalPackages: ['mongodb']
  },
  
  // Disable Turbopack until MongoDB compatibility improves
  turbo: {
    resolveAlias: {
      // Add any necessary aliases here
    }
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Prevent PDF files from being processed during build
    config.module.noParse = /\.pdf$/;

    // Add necessary polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify')
    };

    return config;
  }
}

module.exports = nextConfig