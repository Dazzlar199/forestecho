// PWA 아이콘 생성 스크립트
// Node.js의 Canvas를 사용하지 않고 간단한 SVG로 PNG 생성

const fs = require('fs');
const path = require('path');

// SVG 아이콘 템플릿 (숲울림 테마)
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- 배경 -->
  <rect width="${size}" height="${size}" fill="#e8f4f8"/>

  <!-- 나무 (심플한 디자인) -->
  <g transform="translate(${size/2}, ${size/2})">
    <!-- 나무 몸통 -->
    <rect x="${-size*0.08}" y="${size*0.05}" width="${size*0.16}" height="${size*0.35}" fill="#8b9a9f" rx="${size*0.03}"/>

    <!-- 나뭇잎 레이어 3 -->
    <circle cx="0" cy="${-size*0.15}" r="${size*0.25}" fill="#5f6b6d" opacity="0.7"/>

    <!-- 나뭇잎 레이어 2 -->
    <circle cx="0" cy="${-size*0.2}" r="${size*0.22}" fill="#5f6b6d" opacity="0.85"/>

    <!-- 나뭇잎 레이어 1 -->
    <circle cx="0" cy="${-size*0.25}" r="${size*0.18}" fill="#5f6b6d"/>

    <!-- 하이라이트 -->
    <circle cx="${-size*0.08}" cy="${-size*0.28}" r="${size*0.06}" fill="#d4e9f0" opacity="0.6"/>
  </g>

  <!-- 하단 텍스트 (큰 아이콘에만) -->
  ${size >= 192 ? `
  <text x="50%" y="${size*0.88}" font-family="Arial, sans-serif" font-size="${size*0.12}" font-weight="bold" fill="#5f6b6d" text-anchor="middle">숲울림</text>
  ` : ''}
</svg>
`;

// 필요한 아이콘 크기들
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// public 폴더 경로
const publicDir = path.join(__dirname, '..', 'public');

// 각 크기별 SVG 파일 생성
sizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(publicDir, filename);

  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`✅ 생성됨: ${filename}`);
});

console.log('\n📱 SVG 아이콘이 생성되었습니다!');
console.log('\n💡 더 나은 PNG 아이콘을 만들고 싶다면:');
console.log('1. https://www.figma.com 에서 디자인');
console.log('2. https://realfavicongenerator.net 에서 자동 생성');
console.log('3. Canva나 Photoshop으로 직접 제작');
console.log('\n현재는 SVG 파일도 작동하지만, PNG로 변환하는 게 더 좋습니다.');
