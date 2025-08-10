const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withSourceMaps = require('@zeit/next-source-maps');
const webpack = require('webpack');

module.exports = withBundleAnalyzer(
  withSourceMaps({
    // SEO and Performance Optimizations
    compress: true,
    poweredByHeader: false,
    generateEtags: true,

    // Image Optimization
    images: {
      domains: ['image.tmdb.org'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      formats: ['image/webp', 'image/avif'],
    },

    // Headers for SEO and Security
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
          ],
        },
        {
          source: '/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },

    // Redirects for SEO-friendly URLs
    async redirects() {
      return [
        // Strip default homepage query parameters to keep canonical /
        {
          source: '/',
          has: [
            { type: 'query', key: 'category', value: 'Popular' },
            { type: 'query', key: 'page', value: '1' },
          ],
          destination: '/',
          permanent: true,
        },
        // Also strip just page=1 on homepage
        {
          source: '/',
          has: [{ type: 'query', key: 'page', value: '1' }],
          destination: '/',
          permanent: true,
        },
        // Redirect old movie URLs to new SEO-friendly URLs
        {
          source: '/movie',
          has: [{ type: 'query', key: 'id' }],
          destination: '/movie/:id',
          permanent: true,
        },
        // Redirect alternative movie URLs to main movie page
        {
          source: '/watch-:slug',
          destination: '/movie/:slug',
          permanent: true,
        },
        {
          source: '/download-:slug',
          destination: '/movie/:slug',
          permanent: true,
        },
        {
          source: '/stream-:slug',
          destination: '/movie/:slug',
          permanent: true,
        },
        {
          source: '/genre',
          destination: '/',
          permanent: true,
        },
      ];
    },

    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });

      config.plugins.push(
        new webpack.ProvidePlugin({
          React: 'react',
        }),
      );

      return config;
    },
  }),
);
