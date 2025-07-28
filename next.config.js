/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-ready configuration
  output: 'standalone',
  
  // Experimental features
  experimental: {
    // Proper server actions configuration
    serverActions: {
      bodySizeLimit: '5mb'
    },
    // Optimize these packages
    optimizePackageImports: [
      'pdf-parse',
      'mongodb'
    ],
    // Explicit external packages for server components
    serverExternalPackages: ['mongodb']
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Prevent PDF processing during build
    config.module.noParse = /\.pdf$/;

    // Add necessary polyfills only for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify')
      };
    }

    // Exclude MongoDB native extensions
    config.externals = [...(config.externals || []), 'mongodb-client-encryption'];

    return config;
  },

  // Turbopack configuration (optional)
  turbo: process.env.TURBO === 'true' ? {
    rules: {
      // Exclude MongoDB from Turbopack processing
      '*.node': {
        loaders: ['file-loader']
      }
    }
  } : undefined
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