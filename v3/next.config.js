

module.exports = {
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
  output: 'standalone',
// output: 'export',
// distDir: 'build'
experimental: {
  serverActions: {
    bodySizeLimit: '20mb',
  }
},
  
  
  // 可选：配置整体请求体大小限制（适用于 Pages Router）
  serverRuntimeConfig: {
    // 最大请求体大小（字节）
    maxRequestBodySize: 10 * 1024 * 1024, // 10MB
  },


  async redirects() {
    return [
      {
        source: '/.well-known/webfinger',
        destination: '/api/activitepub/getuserfromurl',
        permanent: true,
      },
      {
        source: '/.well-known/acme-challenge',
        destination: '/api/activitepub/certbot',
        permanent: true,
      },

    ]
  },
}
