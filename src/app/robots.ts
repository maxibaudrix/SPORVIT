// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/_next/',
        '/admin/'
      ]
    },
    sitemap: 'https://sporvit.com/sitemap.xml'
  };
}