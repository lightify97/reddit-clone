const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compiler: {
    styledComponents: true
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
});
