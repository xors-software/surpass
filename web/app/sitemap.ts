import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://whetstone.xors.xyz',
      lastModified: new Date(),
    },
  ];
}