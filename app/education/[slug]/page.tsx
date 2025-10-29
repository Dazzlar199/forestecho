import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ARTICLES } from '@/types/education'
import ArticleContent from '@/components/education/ArticleContent'

// Generate static paths for all articles
export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.id,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.id === slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title.ko} | 숲울림 심리교육`,
    description: article.summary.ko,
    keywords: article.tags.join(', '),
    openGraph: {
      title: article.title.ko,
      description: article.summary.ko,
      type: 'article',
      publishedTime: article.lastUpdated.toISOString(),
      authors: ['숲울림'],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title.ko,
      description: article.summary.ko,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.id === slug)

  if (!article) {
    notFound()
  }

  return <ArticleContent article={article} />
}
