import { ARTICLES } from '@/types/education'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://forestecho.app'

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>숲울림 - 심리교육</title>
    <link>${baseUrl}</link>
    <description>전문 심리상담 서비스. 24시간 언제든지 당신의 이야기를 들어드립니다.</description>
    <language>ko</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${ARTICLES.map(article => `
    <item>
      <title>${article.title.ko}</title>
      <link>${baseUrl}/education/${article.id}</link>
      <description>${article.summary.ko}</description>
      <pubDate>${article.lastUpdated.toUTCString()}</pubDate>
      <guid>${baseUrl}/education/${article.id}</guid>
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  })
}
