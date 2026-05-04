/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // GitHub Pages user site (https://sayulist.github.io/) typically doesn't need basePath.
  // If this was a project site (https://username.github.io/sayulist/), basePath: '/sayulist' would be needed.
  basePath: '', 
  assetPrefix: '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;