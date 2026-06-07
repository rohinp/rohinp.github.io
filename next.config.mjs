import mdx from '@next/mdx';

const withMDX = mdx();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  output: 'export',
  distDir: 'out',
  experimental: {
    mdxRs: true,
  },
};

export default withMDX(nextConfig);
