// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     appDir: true
//   }
// }
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    optimizePackageImports: ['pdf-parse', 'mongodb'],
    serverComponentsExternalPackages: ['mongodb'] // Important for MongoDB
  },
  
  // API route configuration
  output: 'standalone',
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Prevent PDF and MongoDB native extensions from being processed
    config.module.noParse = [/\.pdf$/, /mongodb-client-encryption/];

    // Add necessary polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify')
    };

    // Exclude MongoDB native extensions from bundling
    config.externals = config.externals || [];
    config.externals.push('mongodb-client-encryption');
    
    return config;
  },
  
  // Environment variables configuration
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB
  }
}

module.exports = nextConfig