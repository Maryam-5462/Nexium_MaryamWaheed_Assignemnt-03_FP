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
    optimizePackageImports: ['pdf-parse', 'mongodb']
  },
  
  // Proper API route configuration
  serverActions: {
    bodySizeLimit: '5mb'
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Prevent PDF files from being processed during build
    config.module.noParse = /\.pdf$/;

    // Add buffer polyfill
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify')
      }
    }

    return config;
  }
}

module.exports = nextConfig