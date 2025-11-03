import { MetadataRoute } from 'next'

export const dynamic = 'force-static' // Static export를 위한 설정

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://forestecho.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
