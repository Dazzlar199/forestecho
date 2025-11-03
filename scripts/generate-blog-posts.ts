/**
 * 네이버 블로그 포스팅 자동 생성 스크립트
 *
 * 사용법:
 * npm run generate-blog
 */

import { ARTICLES } from '../types/education'
import * as fs from 'fs'
import * as path from 'path'

// 네이버 블로그용 HTML 템플릿
function generateBlogPost(article: typeof ARTICLES[0]): string {
  const sections = article.content.ko

  let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${article.title.ko}</title>
</head>
<body>

<!-- 제목 -->
<h1 style="color: #2D5016; font-size: 28px; font-weight: bold; margin-bottom: 20px;">
    ${article.title.ko}
</h1>

<!-- 요약 -->
<div style="background: #E8F5E9; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
    <p style="font-size: 16px; line-height: 1.8; color: #333;">
        ${article.summary.ko}
    </p>
</div>

<!-- 카테고리 태그 -->
<div style="margin-bottom: 20px;">
    <span style="background: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px;">
        ${article.category}
    </span>
    <span style="color: #666; font-size: 14px; margin-left: 10px;">
        ⏰ 읽는 시간: ${article.readTime}분
    </span>
</div>

<hr style="border: 0; height: 2px; background: #E0E0E0; margin: 30px 0;">

<!-- 목차 -->
<div style="background: #F5F5F5; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
    <h3 style="color: #2D5016; font-size: 20px; margin-bottom: 15px;">📋 목차</h3>
    <ul style="list-style: none; padding-left: 0;">
${sections.map((section: any, index: number) => `        <li style="margin-bottom: 8px;">
            <a href="#section${index}" style="color: #4CAF50; text-decoration: none;">
                ${index + 1}. ${section.heading || '내용'}
            </a>
        </li>`).join('\n')}
    </ul>
</div>

<!-- 본문 섹션 -->
${sections.map((section: any, sectionIndex: number) => `
<div id="section${sectionIndex}" style="margin-bottom: 40px;">
    <h2 style="color: #2D5016; font-size: 24px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #4CAF50;">
        ${sectionIndex + 1}. ${section.heading || '내용'}
    </h2>

    ${section.paragraphs ? section.paragraphs.map((p: string) => `
    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
        ${p}
    </p>
    `).join('') : ''}

    ${section.list ? `
    <div style="background: #F9FFF9; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
        <${section.list.type === 'numbered' ? 'ol' : 'ul'} style="padding-left: 20px;">
${section.list.items.map((item: string) => `            <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6; color: #333;">
                ${item}
            </li>`).join('\n')}
        </${section.list.type === 'numbered' ? 'ol' : 'ul'}>
    </div>
    ` : ''}
</div>
`).join('')}

<!-- 추천 도서 섹션 (있을 경우) -->
${article.recommendedProducts && article.recommendedProducts.length > 0 ? `
<div style="background: #F0F4F8; padding: 30px; border-radius: 15px; margin: 40px 0;">
    <h3 style="color: #2D5016; font-size: 22px; margin-bottom: 20px;">📚 함께 읽으면 좋은 추천 도서</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;">
${article.recommendedProducts.map((product: any) => `        <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <img src="${product.imageUrl}" alt="${product.title.ko}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; object-fit: cover;">
            <h4 style="font-size: 17px; color: #2D5016; margin-bottom: 10px; font-weight: 600;">${product.title.ko}</h4>
            <p style="font-size: 14px; color: #666; margin-bottom: 15px; line-height: 1.6;">${product.description.ko}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; color: #4CAF50; font-weight: bold;">₩${product.price.toLocaleString()}</span>
                <a href="${product.link}" target="_blank" style="display: inline-block; background: #4CAF50; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
                    구매하기
                </a>
            </div>
        </div>`).join('\n')}
    </div>
    <p style="font-size: 12px; color: #999; margin-top: 15px; text-align: center;">
        파트너스 활동으로 일정 수수료를 제공받을 수 있습니다
    </p>
</div>
` : ''}

<!-- 출처 -->
<div style="background: #FAFAFA; padding: 20px; border-radius: 10px; margin-top: 40px;">
    <h4 style="color: #666; font-size: 16px; margin-bottom: 15px;">📖 참고 자료</h4>
    <ul style="list-style: none; padding-left: 0; font-size: 14px; color: #666;">
${article.sources.map((source: any) => `        <li style="margin-bottom: 8px;">• ${source.name} - ${source.organization}</li>`).join('\n')}
    </ul>
</div>

<!-- CTA -->
<div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 40px; border-radius: 15px; text-align: center; margin-top: 40px;">
    <h3 style="color: white; font-size: 24px; margin-bottom: 15px;">🌲 숲울림에서 AI 상담 받아보세요</h3>
    <p style="color: white; font-size: 16px; margin-bottom: 25px; opacity: 0.9;">
        24시간 언제든지, 전문적인 AI 심리상담이 준비되어 있습니다
    </p>
    <a href="https://forestecho.app" target="_blank" style="display: inline-block; background: white; color: #11998e; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 18px;">
        지금 상담하기 →
    </a>
</div>

<!-- 해시태그 -->
<div style="margin-top: 40px; padding-top: 20px; border-top: 2px dashed #E0E0E0;">
    <p style="color: #666; font-size: 14px; line-height: 1.8;">
        ${article.tags.map((tag: string) => `#${tag}`).join(' ')} #숲울림 #AI상담 #정신건강 #심리교육
    </p>
</div>

</body>
</html>
`

  return html
}

// 마크다운 버전도 생성
function generateMarkdown(article: typeof ARTICLES[0]): string {
  const sections = article.content.ko

  let markdown = `# ${article.title.ko}

> ${article.summary.ko}

**카테고리**: ${article.category} | **읽는 시간**: ${article.readTime}분

---

## 📋 목차

${sections.map((section: any, index: number) => `${index + 1}. [${section.heading || '내용'}](#section${index})`).join('\n')}

---

${sections.map((section: any, sectionIndex: number) => `
## <a name="section${sectionIndex}"></a>${sectionIndex + 1}. ${section.heading || '내용'}

${section.paragraphs ? section.paragraphs.join('\n\n') : ''}

${section.list ? `
${section.list.items.map((item: string, idx: number) => section.list.type === 'numbered' ? `${idx + 1}. ${item}` : `- ${item}`).join('\n')}
` : ''}
`).join('\n')}

${article.recommendedProducts && article.recommendedProducts.length > 0 ? `
## 📚 함께 읽으면 좋은 추천 도서

${article.recommendedProducts.map((product: any) => `
### ${product.title.ko}

![${product.title.ko}](${product.imageUrl})

${product.description.ko}

[상품 보기](${product.link}) - ₩${product.price.toLocaleString()}

---
`).join('\n')}

**이미지 URL 목록** (복사해서 블로그에 붙여넣기):
${article.recommendedProducts.map((product: any) => `- ${product.imageUrl}`).join('\n')}
` : ''}

## 📖 참고 자료

${article.sources.map((source: any) => `- ${source.name} - ${source.organization}`).join('\n')}

---

## 🌲 숲울림에서 AI 상담 받아보세요

24시간 언제든지, 전문적인 AI 심리상담이 준비되어 있습니다.

👉 [지금 상담하기](https://forestecho.app)

---

**해시태그**: ${article.tags.map((tag: string) => `#${tag}`).join(' ')} #숲울림 #AI상담 #정신건강 #심리교육
`

  return markdown
}

// 메인 실행
async function main() {
  const outputDir = path.join(process.cwd(), 'blog-posts')

  // 디렉토리 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const htmlDir = path.join(outputDir, 'html')
  const mdDir = path.join(outputDir, 'markdown')

  if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true })
  if (!fs.existsSync(mdDir)) fs.mkdirSync(mdDir, { recursive: true })

  console.log('📝 네이버 블로그 포스팅 생성 중...\n')

  ARTICLES.forEach((article, index) => {
    // HTML 버전
    const html = generateBlogPost(article)
    const htmlPath = path.join(htmlDir, `${index + 1}_${article.id}.html`)
    fs.writeFileSync(htmlPath, html, 'utf-8')

    // Markdown 버전
    const markdown = generateMarkdown(article)
    const mdPath = path.join(mdDir, `${index + 1}_${article.id}.md`)
    fs.writeFileSync(mdPath, markdown, 'utf-8')

    console.log(`✅ ${index + 1}. ${article.title.ko}`)
    console.log(`   📄 HTML: ${htmlPath}`)
    console.log(`   📝 MD: ${mdPath}\n`)
  })

  console.log(`\n🎉 총 ${ARTICLES.length}개의 블로그 포스트가 생성되었습니다!`)
  console.log(`📂 저장 위치: ${outputDir}`)
  console.log(`\n📋 사용 방법:`)
  console.log(`1. html 폴더의 파일을 브라우저로 열기`)
  console.log(`2. 내용 전체 선택 (Cmd/Ctrl + A)`)
  console.log(`3. 복사 (Cmd/Ctrl + C)`)
  console.log(`4. 네이버 블로그 글쓰기 → HTML 모드 → 붙여넣기`)
  console.log(`\n💡 쿠팡 제품 이미지는:`)
  console.log(`   각 제품 박스에 이미지 URL이 표시되어 있습니다`)
  console.log(`   URL 복사 → 네이버 블로그 "사진 추가" → URL 붙여넣기`)
}

main().catch(console.error)
