import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 允许所有 https 域名（⚠️可能有安全风险）
      },
    ],
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
       
    experimental: {
        serverActions: {
        bodySizeLimit: '20mb',
        },
    },

    serverRuntimeConfig: {
        maxRequestBodySize: 10 * 1024 * 1024,
    },
};

export default withNextIntl(config);
