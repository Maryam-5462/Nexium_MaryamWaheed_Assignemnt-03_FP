/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable standalone output to prevent Windows symlink errors
  // output: 'standalone', // Commented out for Windows compatibility
  
  experimental: {
    serverActions: {},
    optimizePackageImports: ['pdf-parse']
  },
  
  // External server packages
  serverExternalPackages: ['mongodb'],
  
  // Custom webpack configuration
  webpack: (config, { isServer }) => {
    // Prevent processing of PDF and MongoDB native files
    config.module.noParse = [/\.pdf$/, /mongodb-client-encryption/];
    
    // Exclude problematic native modules
    config.externals = {
      ...config.externals,
      'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
      'aws4': 'commonjs aws4',
      'snappy': 'commonjs snappy',
      'kerberos': 'commonjs kerberos'
    };
    
    // Add necessary polyfills (client-side only)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify')
        // crypto: false - intentionally removed to prevent conflicts
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