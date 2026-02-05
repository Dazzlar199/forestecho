/**
 * TypeScript 파일에서 ARTICLES 데이터를 JSON으로 추출하는 스크립트
 */

const fs = require('fs');
const path = require('path');

// types/education.ts 파일 읽기 (git에서 복원한 원본)
const filePath = '/tmp/education-full.ts';
const content = fs.readFileSync(filePath, 'utf-8');

// ARTICLES 배열 찾기
const articlesMatch = content.match(/export const ARTICLES: Article\[\] = (\[[\s\S]*?\n\])/);
const categoriesMatch = content.match(/export const ARTICLE_CATEGORIES = (\[[\s\S]*?\n\])/);

if (!articlesMatch || !categoriesMatch) {
  console.error('❌ ARTICLES 또는 ARTICLE_CATEGORIES를 찾을 수 없습니다.');
  process.exit(1);
}

// TypeScript 객체를 JSON으로 변환하기 위해 평가
// 주의: eval은 안전한 데이터에만 사용
try {
  // Date 객체 처리를 위한 함수
  const parseDate = (dateStr) => {
    if (dateStr.includes('new Date')) {
      const match = dateStr.match(/new Date\(['"]([^'"]+)['"]\)/);
      return match ? match[1] : new Date().toISOString();
    }
    return dateStr;
  };

  // TypeScript를 JavaScript로 변환
  let articlesStr = articlesMatch[1];
  let categoriesStr = categoriesMatch[1];

  // Date 객체를 문자열로 변환
  articlesStr = articlesStr.replace(/new Date\(['"]([^'"]+)['"]\)/g, '"$1"');

  // as ArticleCategory 제거
  categoriesStr = categoriesStr.replace(/as ArticleCategory/g, '');

  // eval을 사용하여 JavaScript 객체로 파싱 (안전한 데이터만)
  const articlesData = eval(`(${articlesStr})`);
  const categoriesData = eval(`(${categoriesStr})`);

  // 데이터 저장
  const outputDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // JSON.stringify로 유효한 JSON 생성
  fs.writeFileSync(
    path.join(outputDir, 'articles.json'),
    JSON.stringify(articlesData, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(outputDir, 'categories.json'),
    JSON.stringify(categoriesData, null, 2),
    'utf-8'
  );

  console.log('✅ articles.json 생성 완료');
  console.log('✅ categories.json 생성 완료');

  // 파일 크기 확인
  const articlesSize = fs.statSync(path.join(outputDir, 'articles.json')).size;
  console.log(`📦 articles.json: ${(articlesSize / 1024).toFixed(2)} KB`);

} catch (error) {
  console.error('❌ 데이터 추출 실패:', error.message);
  process.exit(1);
}
