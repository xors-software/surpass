import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://surpass.xors.xyz',
      lastModified: new Date(),
    },
  ];
}