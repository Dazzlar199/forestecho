import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
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
      url: `https://forestecho.app/education/${article.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title.ko,
      description: article.summary.ko,
    },
    alternates: {
      canonical: `https://forestecho.app/education/${article.id}`,
      languages: {
        'ko-KR': `https://forestecho.app/education/${article.id}`,
        'en-US': `https://forestecho.app/education/${article.id}`,
        'ja-JP': `https://forestecho.app/education/${article.id}`,
        'zh-CN': `https://forestecho.app/education/${article.id}`,
      },
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.id === slug)

  if (!article) {
    notFound()
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title.ko,
    description: article.summary.ko,
    author: {
      '@type': 'Organization',
      name: '숲울림',
      url: 'https://forestecho.app',
    },
    publisher: {
      '@type': 'Organization',
      name: '숲울림',
      url: 'https://forestecho.app',
    },
    datePublished: article.lastUpdated.toISOString(),
    dateModified: article.lastUpdated.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://forestecho.app/education/${article.id}`,
    },
    keywords: article.tags.join(', '),
    articleSection: article.category,
    inLanguage: 'ko-KR',
    about: {
      '@type': 'MedicalCondition',
      name: article.title.ko,
    },
  }

  return (
    <>
      <Script
        id={`article-jsonld-${article.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleContent article={article} />
    </>
  )
}
