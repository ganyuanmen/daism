

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
  },
 
},

  async redirects() {
    return [
      {
        source: '/.well-known/webfinger',
        destination: '/api/activitepub/getuserfromurl',
        permanent: true,
      },
    ]
  },
}
