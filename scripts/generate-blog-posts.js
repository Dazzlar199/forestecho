/**
 * 네이버 블로그 포스팅 자동 생성 스크립트
 *
 * 사용법:
 * node scripts/generate-blog-posts.js
 */

const { ARTICLES } = require('../types/education')
const fs = require('fs')
const path = require('path')

// 네이버 블로그용 HTML 템플릿
function generateBlogPost(article) {
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
${sections.map((section, index) => `        <li style="margin-bottom: 8px;">
            <a href="#section${index}" style="color: #4CAF50; text-decoration: none;">
                ${index + 1}. ${section.heading || '내용'}
            </a>
        </li>`).join('\n')}
    </ul>
</div>

<!-- 본문 섹션 -->
${sections.map((section, sectionIndex) => `
<div id="section${sectionIndex}" style="margin-bottom: 40px;">
    <h2 style="color: #2D5016; font-size: 24px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #4CAF50;">
        ${sectionIndex + 1}. ${section.heading || '내용'}
    </h2>

    ${section.paragraphs ? section.paragraphs.map(p => `
    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
        ${p}
    </p>
    `).join('') : ''}

    ${section.list ? `
    <div style="background: #F9FFF9; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
        <${section.list.type === 'numbered' ? 'ol' : 'ul'} style="padding-left: 20px;">
${section.list.items.map(item => `            <li style="margin-bottom: 15px; font-size: 16px; line-height: 1.6; color: #333;">
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
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
${article.recommendedProducts.map(product => `        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <img src="${product.imageUrl}" alt="${product.title.ko}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;">
            <h4 style="font-size: 16px; color: #333; margin-bottom: 8px;">${product.title.ko}</h4>
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">${product.description.ko}</p>
            <a href="${product.link}" target="_blank" style="display: inline-block; background: #4CAF50; color: white; padding: 8px 15px; border-radius: 5px; text-decoration: none; font-size: 14px;">
                상품 보기 (₩${product.price.toLocaleString()})
            </a>
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
${article.sources.map(source => `        <li style="margin-bottom: 8px;">• ${source.name} - ${source.organization}</li>`).join('\n')}
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
        ${article.tags.map(tag => `#${tag}`).join(' ')} #숲울림 #AI상담 #정신건강 #심리교육
    </p>
</div>

</body>
</html>
`

  return html
}

// 마크다운 버전도 생성
function generateMarkdown(article) {
  const sections = article.content.ko

  let markdown = `# ${article.title.ko}

> ${article.summary.ko}

**카테고리**: ${article.category} | **읽는 시간**: ${article.readTime}분

---

## 📋 목차

${sections.map((section, index) => `${index + 1}. [${section.heading || '내용'}](#section${index})`).join('\n')}

---

${sections.map((section, sectionIndex) => `
## <a name="section${sectionIndex}"></a>${sectionIndex + 1}. ${section.heading || '내용'}

${section.paragraphs ? section.paragraphs.join('\n\n') : ''}

${section.list ? `
${section.list.items.map((item, idx) => section.list.type === 'numbered' ? `${idx + 1}. ${item}` : `- ${item}`).join('\n')}
` : ''}
`).join('\n')}

${article.recommendedProducts && article.recommendedProducts.length > 0 ? `
## 📚 함께 읽으면 좋은 추천 도서

${article.recommendedProducts.map(product => `
### ${product.title.ko}
${product.description.ko}
[상품 보기](${product.link}) - ₩${product.price.toLocaleString()}
`).join('\n')}
` : ''}

## 📖 참고 자료

${article.sources.map(source => `- ${source.name} - ${source.organization}`).join('\n')}

---

## 🌲 숲울림에서 AI 상담 받아보세요

24시간 언제든지, 전문적인 AI 심리상담이 준비되어 있습니다.

👉 [지금 상담하기](https://forestecho.app)

---

**해시태그**: ${article.tags.map(tag => `#${tag}`).join(' ')} #숲울림 #AI상담 #정신건강 #심리교육
`

  return markdown
}

// 메인 실행
async function main() {
  const outputDir = path.join(__dirname, '../blog-posts')

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
  console.log(`1. html 폴더의 파일을 열어서 내용을 복사`)
  console.log(`2. 네이버 블로그 글쓰기 → HTML 모드로 붙여넣기`)
  console.log(`3. 또는 markdown 폴더의 파일을 일반 텍스트로 복사`)
  console.log(`\n💡 이미지 제작 도구:`)
  console.log(`- Canva (canva.com) - 무료 템플릿 많음`)
  console.log(`- Figma (figma.com) - 전문적인 디자인`)
  console.log(`- 포토샵 Express - 간단한 편집`)
}

main().catch(console.error)
