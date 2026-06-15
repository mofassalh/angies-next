import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://angiesknb.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://angiesknb.com/menu', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://angiesknb.com/delivery', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://angiesknb.com/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
