import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    domains: ['egyxvzjfqnpcfdnwusxn.supabase.co'],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://angies-admin.vercel.app',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: 'https://angies-admin.vercel.app/admin/:path*',
        permanent: false,
      },
    ]
  },
};
export default nextConfig;
