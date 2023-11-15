const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['orangekaos.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'orangekaos.com',
        pathname: '/media/images/**',
      },
    ],
  },
  // Other Next.js configuration ...
};

module.exports = withNextIntl(nextConfig);
