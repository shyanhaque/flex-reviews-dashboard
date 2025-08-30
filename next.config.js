/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    HOSTAWAY_API_KEY: process.env.HOSTAWAY_API_KEY,
    HOSTAWAY_ACCOUNT_ID: process.env.HOSTAWAY_ACCOUNT_ID,
  },
};

export default nextConfig;
