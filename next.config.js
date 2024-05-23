/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
  output: 'standalone',
// output: 'export',
// distDir: 'build'

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
