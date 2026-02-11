import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
          }
        ]
      }
    ]
  },

  /** ---------------- 核心修复点 ---------------- */
  // 1. 固定 Build ID，确保多次构建（或多容器部署）时 Action ID 尽可能一致
  generateBuildId: async () => {
    // 建议使用 Git 的 Hash 或者环境变量中的版本号
    return process.env.NEXT_PUBLIC_VERSION || 'build-' + Date.now();
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
      // 2. 如果你的网站有多个域名或通过代理访问，建议显式允许来源
      // allowedOrigins: ['your-domain.com', 'localhost:3000'], 
    },
  },

  /** ---------------- 其他配置保持不变 ---------------- */
  output: 'standalone',
  productionBrowserSourceMaps: false,
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/.well-known/webfinger',
  //       destination: '/api/activitepub/getuserfromurl',
  //       permanent: true,
  //     },
  //     {
  //       source: '/.well-known/acme-challenge',
  //       destination: '/api/activitepub/certbot',
  //       permanent: true,
  //     },
  //   ]
  // },

  env: {
    // ...保持你原有的 env 配置
    // NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
         NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
      NEXT_PUBLIC_BLOCKCHAIN_NETWORK: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK,
      NEXT_PUBLIC_HTTPS_URL: process.env.NEXT_PUBLIC_HTTPS_URL,
      NEXT_PUBLIC_WSS_URL: process.env.NEXT_PUBLIC_WSS_URL,
      NEXT_PUBLIC_ETHERSCAN_URL: process.env.NEXT_PUBLIC_ETHERSCAN_URL,
      NEXT_PUBLIC_ADMI_ACTOR: process.env.NEXT_PUBLIC_ADMI_ACTOR,
      NEXT_PUBLIC_TOTAL: process.env.NEXT_PUBLIC_TOTAL,
      NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
      NEXT_PUBLIC_SCREGISTRAR: process.env.NEXT_PUBLIC_SCREGISTRAR,
      NEXT_PUBLIC_IADD: process.env.NEXT_PUBLIC_IADD,
      NEXT_PUBLIC_UNITTOKEN: process.env.NEXT_PUBLIC_UNITTOKEN,
      NEXT_PUBLIC_SCTOKEN: process.env.NEXT_PUBLIC_SCTOKEN,
      NEXT_PUBLIC_COMMULATE: process.env.NEXT_PUBLIC_COMMULATE,
      NEXT_PUBLIC_SC: process.env.NEXT_PUBLIC_SC,
      NEXT_PUBLIC_UNITNFT: process.env.NEXT_PUBLIC_UNITNFT,
      NEXT_PUBLIC_DAISMDOMAIN: process.env.NEXT_PUBLIC_DAISMDOMAIN,
      NEXT_PUBLIC_DAISMNFT: process.env.NEXT_PUBLIC_DAISMNFT,
      NEXT_PUBLIC_DAISMSINGLENFT: process.env.NEXT_PUBLIC_DAISMSINGLENFT,
      NEXT_PUBLIC_DAiSMIADDPROXY: process.env.NEXT_PUBLIC_DAiSMIADDPROXY,
      NEXT_PUBLIC_DONATION: process.env.NEXT_PUBLIC_DONATION,
  },
};

export default withNextIntl(config);


// import {NextConfig} from 'next';
// import createNextIntlPlugin from 'next-intl/plugin';

// const withNextIntl = createNextIntlPlugin();

// const config: NextConfig = {
//     /** ---------------- 基础 ---------------- */
//   reactStrictMode: true,
//   poweredByHeader: false,

//   /** ---------------- App Router ---------------- */
//   experimental: {
//     /**
//      * Server Actions
//      * Next 16 中这是最安全的写法
//      */
//     serverActions: {
//       bodySizeLimit: '20mb',
//     },
//   },

//   output: 'standalone',
//    productionBrowserSourceMaps: false,
   
//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '**', // 允许所有 https 域名（⚠️可能有安全风险）
//       },
//     ],
//   },
//     async redirects() {
//         return [
//           {
//             source: '/.well-known/webfinger',
//             destination: '/api/activitepub/getuserfromurl',
//             permanent: true,
//           },
//           {
//             source: '/.well-known/acme-challenge',
//             destination: '/api/activitepub/certbot',
//             permanent: true,
//           },
//         ]
//       },
       


//     // 让前端可以访问 env 中的变量
//     env: {
//       NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
//       NEXT_PUBLIC_BLOCKCHAIN_NETWORK: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK,
//       NEXT_PUBLIC_HTTPS_URL: process.env.NEXT_PUBLIC_HTTPS_URL,
//       NEXT_PUBLIC_WSS_URL: process.env.NEXT_PUBLIC_WSS_URL,
//       NEXT_PUBLIC_ETHERSCAN_URL: process.env.NEXT_PUBLIC_ETHERSCAN_URL,
//       NEXT_PUBLIC_ADMI_ACTOR: process.env.NEXT_PUBLIC_ADMI_ACTOR,
//       NEXT_PUBLIC_TOTAL: process.env.NEXT_PUBLIC_TOTAL,
//       NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
//       NEXT_PUBLIC_SCREGISTRAR: process.env.NEXT_PUBLIC_SCREGISTRAR,
//       NEXT_PUBLIC_IADD: process.env.NEXT_PUBLIC_IADD,
//       NEXT_PUBLIC_UNITTOKEN: process.env.NEXT_PUBLIC_UNITTOKEN,
//       NEXT_PUBLIC_SCTOKEN: process.env.NEXT_PUBLIC_SCTOKEN,
//       NEXT_PUBLIC_COMMULATE: process.env.NEXT_PUBLIC_COMMULATE,
//       NEXT_PUBLIC_SC: process.env.NEXT_PUBLIC_SC,
//       NEXT_PUBLIC_UNITNFT: process.env.NEXT_PUBLIC_UNITNFT,
//       NEXT_PUBLIC_DAISMDOMAIN: process.env.NEXT_PUBLIC_DAISMDOMAIN,
//       NEXT_PUBLIC_DAISMNFT: process.env.NEXT_PUBLIC_DAISMNFT,
//       NEXT_PUBLIC_DAISMSINGLENFT: process.env.NEXT_PUBLIC_DAISMSINGLENFT,
//       NEXT_PUBLIC_DAiSMIADDPROXY: process.env.NEXT_PUBLIC_DAiSMIADDPROXY,
//       NEXT_PUBLIC_DONATION: process.env.NEXT_PUBLIC_DONATION,
//     },
// };

// export default withNextIntl(config);
