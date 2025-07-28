/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
    optimizePackageImports: ['pdf-parse']
  },
  serverExternalPackages: ['mongodb'],
  webpack: (config, { isServer }) => {  // Destructure isServer from the second parameter
    // Prevent processing of PDF and MongoDB native files
    config.module.noParse = [/\.pdf$/, /mongodb-client-encryption/];
    
    // Correct externals configuration
    config.externals = {
      ...(config.externals || {}),
      'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
      'aws4': 'commonjs aws4',
      'snappy': 'commonjs snappy',
      'kerberos': 'commonjs kerberos'
    };
    
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