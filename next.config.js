/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration for Vercel
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  experimental: {
    serverActions: true, // Simple boolean format for Vercel compatibility
    optimizePackageImports: ['pdf-parse', 'mongodb']
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Prevent processing of PDF and MongoDB native files
    config.module.noParse = /\.pdf$/;
    
    // Client-side polyfills (only add if not server)
    if (!isServer) {
      config.resolve.fallback = {
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify')
      };
    }
    
    return config;
  }
}

module.exports = nextConfig
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Disable Turbopack for MongoDB compatibility
//   experimental: {
//     serverActions: {},
//     optimizePackageImports: ['pdf-parse'],
//     // New format for external packages
//     serverExternalPackages: ['mongodb']
//   },
  
//   // Disable Turbopack until MongoDB compatibility improves
//   turbo: {
//     resolveAlias: {
//       // Add any necessary aliases here
//     }
//   },

//   // Webpack configuration
//   webpack: (config, { isServer }) => {
//     // Prevent PDF files from being processed during build
//     config.module.noParse = /\.pdf$/;

//     // Add necessary polyfills
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       buffer: require.resolve('buffer'),
//       stream: require.resolve('stream-browserify'),
//       crypto: require.resolve('crypto-browserify')
//     };

//     return config;
//   }
// }

// module.exports = nextConfig