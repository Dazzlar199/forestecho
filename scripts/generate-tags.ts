/**
 * 네이버 블로그 태그 생성 스크립트
 * 각 아티클마다 관련 태그 30개를 자동 생성합니다
 */

import { ARTICLES } from '../types/education'
import * as fs from 'fs'
import * as path from 'path'

// 기본 태그 (모든 아티클 공통)
const commonTags = [
  '심리상담',
  'AI상담',
  '정신건강',
  '멘탈케어',
  '마음건강',
  '심리교육',
  '정신건강정보',
  '숲울림',
  'ForestEcho',
  '온라인상담',
  '24시간상담',
]

// 카테고리별 태그
const categoryTags: Record<string, string[]> = {
  'basics': ['정신건강기본', '심리기초', '정신건강개념', '멘탈헬스기초'],
  'conditions': ['정신질환', '정신건강질환', '마음의병', '심리장애', '정신과질환'],
  'management': ['스트레스관리', '감정조절', '대처방법', '심리관리', '자기관리'],
  'lifestyle': ['생활습관', '건강한습관', '일상관리', '라이프스타일', '건강생활'],
  'relationships': ['대인관계', '인간관계', '관계스트레스', '사회성', '소통'],
  'workplace': ['직장생활', '직장인멘탈', '직장스트레스', '워라밸', '번아웃'],
  'adolescent': ['청소년', '10대', '청소년상담', '청소년정신건강', '학생상담', '청소년멘탈']
}

// 주제별 관련 태그
const topicTags: Record<string, string[]> = {
  '우울': ['우울증', '우울감', '무기력', '우울증상', '우울증극복', '우울증치료'],
  '불안': ['불안장애', '불안증', '불안감', '불안극복', '불안관리', '걱정'],
  '스트레스': ['스트레스해소', '스트레스관리법', '스트레스완화', '스트레스대처'],
  '수면': ['불면증', '수면장애', '수면관리', '숙면', '수면건강'],
  '번아웃': ['직장인번아웃', '번아웃증후군', '소진', '탈진'],
  '공황': ['공황장애', '공황발작', '공황극복', '공황증상'],
  '사회불안': ['사회불안장애', '대인공포', '사회공포증', '사람두려움'],
  '강박': ['강박장애', 'OCD', '강박증', '강박행동'],
  '분노': ['분노조절', '화조절', '감정표현', '분노관리'],
  '감정': ['감정조절', '감정관리', '감정표현', '정서조절'],
  '슬픔': ['애도', '상실', '슬픔극복', '비애'],
  '운동': ['운동과정신건강', '신체활동', '건강운동'],
  '영양': ['정신건강영양', '식습관', '건강식단'],
  '명상': ['마음챙김', '명상법', '집중', '현재'],
  '경계': ['경계설정', '거절하기', '자기주장'],
  '의사소통': ['대화법', '소통', '커뮤니케이션'],
  '청소년': ['청소년우울', '학업스트레스', '왕따', '사이버불링'],
  '디지털': ['디지털웰빙', '스크린타임', '디지털디톡스', 'SNS중독'],
  '자기돌봄': ['셀프케어', '자기관리', '자기사랑', '힐링']
}

function generateTags(article: typeof ARTICLES[0]): string[] {
  const tags = new Set<string>()

  // 1. 기본 태그 추가 (일부만 - SEO 낮은 것 제외)
  const selectedCommonTags = ['심리상담', 'AI상담', '정신건강', '숲울림', 'ForestEcho']
  selectedCommonTags.forEach(tag => tags.add(tag))

  // 2. 카테고리 태그 추가
  if (categoryTags[article.category]) {
    categoryTags[article.category].forEach(tag => tags.add(tag))
  }

  // 3. 아티클 자체 태그 추가
  article.tags.forEach(tag => tags.add(tag))

  // 4. 제목/요약에서 키워드 찾아서 관련 태그 추가
  const text = (article.title.ko + ' ' + article.summary.ko).toLowerCase()

  Object.entries(topicTags).forEach(([keyword, relatedTags]) => {
    if (text.includes(keyword.toLowerCase())) {
      relatedTags.forEach(tag => tags.add(tag))
    }
  })

  // 5. 아티클별 추가 태그
  // 우울증
  if (article.id.includes('conditions-1')) {
    ['우울증자가진단', '우울증원인', '우울증증상체크', '항우울제', '심리치료'].forEach(tag => tags.add(tag))
  }

  // 불안장애
  if (article.id.includes('conditions-2')) {
    ['범불안장애', '사회불안', '공황', '불안증상', '불안치료'].forEach(tag => tags.add(tag))
  }

  // PTSD
  if (article.id.includes('conditions-3')) {
    ['외상', '트라우마', 'PTSD', '심리적외상', '외상치료'].forEach(tag => tags.add(tag))
  }

  // 스트레스 관리
  if (article.id.includes('management-1')) {
    ['스트레스해소법', '스트레스테스트', '이완기법', '호흡법'].forEach(tag => tags.add(tag))
  }

  // 수면
  if (article.id.includes('lifestyle-1')) {
    ['수면위생', '수면패턴', '수면리듬', '멜라토닌'].forEach(tag => tags.add(tag))
  }

  // 번아웃
  if (article.id.includes('workplace-1')) {
    ['직장인건강', '업무스트레스', '회사생활', '퇴사고민'].forEach(tag => tags.add(tag))
  }

  // 의사소통
  if (article.id.includes('relationships-1')) {
    ['듣기기술', '공감', '비폭력대화', '경청'].forEach(tag => tags.add(tag))
  }

  // 운동
  if (article.id.includes('lifestyle-2')) {
    ['유산소운동', '걷기', '요가', '필라테스', '근력운동'].forEach(tag => tags.add(tag))
  }

  // 명상
  if (article.id.includes('management-2')) {
    ['마음챙김명상', '호흡명상', 'MBSR', '정념'].forEach(tag => tags.add(tag))
  }

  // 영양
  if (article.id.includes('lifestyle-3')) {
    ['오메가3', '세로토닌', '비타민D', '영양제', '건강식품'].forEach(tag => tags.add(tag))
  }

  // 경계설정
  if (article.id.includes('relationships-2')) {
    ['NO라고말하기', '자기주장훈련', '건강한거절'].forEach(tag => tags.add(tag))
  }

  // 워라밸
  if (article.id.includes('workplace-2')) {
    ['일과삶의균형', '야근', '저녁있는삶', '퇴근후루틴'].forEach(tag => tags.add(tag))
  }

  // 강박장애
  if (article.id.includes('ocd')) {
    ['강박사고', '강박행동', '반복행동', '확인강박', '청결강박'].forEach(tag => tags.add(tag))
  }

  // 분노조절
  if (article.id.includes('anger')) {
    ['화내는법', '분노표출', '억울함', '짜증', '인내심'].forEach(tag => tags.add(tag))
  }

  // 공황장애
  if (article.id.includes('conditions-4')) {
    ['공황발작증상', '과호흡', '심장두근거림', '공황극복후기'].forEach(tag => tags.add(tag))
  }

  // 사회불안
  if (article.id.includes('conditions-5')) {
    ['발표불안', '시선공포', '얼굴홍조', '떨림'].forEach(tag => tags.add(tag))
  }

  // 감정조절
  if (article.id.includes('management-3')) {
    ['DBT', '감정일기', '감정코칭', '정서지능'].forEach(tag => tags.add(tag))
  }

  // 슬픔과 상실
  if (article.id.includes('management-4')) {
    ['애도과정', '사별', '상실감', '슬픔치유', '죽음'].forEach(tag => tags.add(tag))
  }

  // 전문가 도움
  if (article.id.includes('basics-2')) {
    ['상담받기', '정신과', '심리상담센터', '병원찾기', '치료비용'].forEach(tag => tags.add(tag))
  }

  // 디지털 웰빙
  if (article.id.includes('lifestyle-4')) {
    ['스마트폰중독', 'SNS피로', '유튜브중독', '게임중독', '디지털단식'].forEach(tag => tags.add(tag))
  }

  // 자기돌봄
  if (article.id.includes('lifestyle-5')) {
    ['자기돌봄루틴', '나를위한시간', '힐링타임', '취미생활'].forEach(tag => tags.add(tag))
  }

  // 청소년 우울증
  if (article.id.includes('adolescent-1')) {
    ['10대우울', '중고등학생', '청소년자살', '학생상담'].forEach(tag => tags.add(tag))
  }

  // 학업 스트레스
  if (article.id.includes('adolescent-2')) {
    ['시험스트레스', '성적스트레스', '입시', '수능', '내신'].forEach(tag => tags.add(tag))
  }

  // 괴롭힘
  if (article.id.includes('adolescent-3')) {
    ['학교폭력', '집단따돌림', '왕따', '사이버불링', '학교상담'].forEach(tag => tags.add(tag))
  }

  // 소셜미디어
  if (article.id.includes('adolescent-4')) {
    ['틱톡', '인스타그램', 'SNS비교', '좋아요중독', '청소년SNS'].forEach(tag => tags.add(tag))
  }

  // 완벽주의 (있다면)
  if (article.title.ko.includes('완벽')) {
    ['완벽주의성향', '높은기준', '자기비판', '실수두려움'].forEach(tag => tags.add(tag))
  }

  // 100자 제한 (네이버 블로그 태그 입력란 제한)
  const allTags = Array.from(tags)
  const finalTags: string[] = []
  let currentLength = 0

  for (const tag of allTags) {
    // # 포함한 길이 계산 (태그 사이 공백 포함)
    const tagWithHash = `#${tag}`
    const additionalLength = finalTags.length === 0
      ? tagWithHash.length
      : tagWithHash.length + 1 // 공백 포함

    if (currentLength + additionalLength <= 100) {
      finalTags.push(tag)
      currentLength += additionalLength
    } else {
      break // 100자 초과하면 중단
    }
  }

  return finalTags
}

// 메인 실행
async function main() {
  const outputDir = path.join(process.cwd(), 'blog-posts')
  const tagsDir = path.join(outputDir, 'tags')

  if (!fs.existsSync(tagsDir)) {
    fs.mkdirSync(tagsDir, { recursive: true })
  }

  console.log('🏷️  네이버 블로그 태그 생성 중...\n')

  // 전체 태그 파일 (모든 아티클)
  const allTagsContent = ARTICLES.map((article, index) => {
    const tags = generateTags(article)
    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${index + 1}. ${article.title.ko}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 태그 (${tags.length}개):

${tags.map(tag => `#${tag}`).join(' ')}

💡 복사 방법:
1. 위의 태그들을 전체 선택 (마우스 드래그)
2. 복사 (Cmd/Ctrl + C)
3. 네이버 블로그 글쓰기 하단 "태그" 입력란에 붙여넣기
4. 자동으로 # 기호로 구분되어 태그가 생성됩니다

`
  }).join('\n\n')

  const allTagsPath = path.join(tagsDir, '모든_아티클_태그.txt')
  fs.writeFileSync(allTagsPath, allTagsContent, 'utf-8')

  console.log(`✅ 전체 태그 파일 생성 완료:`)
  console.log(`   📄 ${allTagsPath}\n`)

  // 개별 태그 파일
  ARTICLES.forEach((article, index) => {
    const tags = generateTags(article)
    const content = `${article.title.ko}

태그 (${tags.length}개):

${tags.map(tag => `#${tag}`).join(' ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
복사 방법:
1. 위의 태그들을 마우스로 드래그하여 선택
2. 복사 (Cmd/Ctrl + C)
3. 네이버 블로그 "태그" 입력란에 붙여넣기
4. 스페이스로 구분되어 자동으로 태그가 생성됩니다
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

    const tagPath = path.join(tagsDir, `${index + 1}_${article.id}_tags.txt`)
    fs.writeFileSync(tagPath, content, 'utf-8')

    console.log(`✅ ${index + 1}. ${article.title.ko} (${tags.length}개 태그)`)
  })

  console.log(`\n🎉 총 ${ARTICLES.length}개 아티클의 태그가 생성되었습니다!`)
  console.log(`📂 저장 위치: ${tagsDir}`)
  console.log(`\n💡 사용 팁:`)
  console.log(`1. "모든_아티클_태그.txt" 파일 하나에 모든 태그가 정리되어 있습니다`)
  console.log(`2. 개별 파일은 각 아티클별로 태그만 따로 저장되어 있습니다`)
  console.log(`3. 태그를 복사해서 네이버 블로그 "태그" 입력란에 붙여넣으면 자동으로 분리됩니다`)
}

main().catch(console.error)
