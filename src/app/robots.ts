import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/account',
          '/cart',
          '/checkout',
          '/login',
          '/order-confirmed',
          '/orders',
          '/profile',
          '/reset-password',
        ],
      },
    ],
    sitemap: 'https://angiesknb.com/sitemap.xml',
  }
}
