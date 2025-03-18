import type { NextConfig } from "next";
// import { withContentlayer } from 'next-contentlayer2'

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {};

module.exports = withContentlayer(nextConfig);
