import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.forestecho',
  appName: '숲울림',
  // webDir을 빈 문자열로 설정하여 로컬 파일 대신 서버 사용
  webDir: 'www', // 더미 디렉토리
  server: {
    // 앱이 항상 실제 웹사이트를 로드하도록 설정
    url: process.env.CAP_SERVER_URL || 'https://forestecho.app',
    cleartext: false,
  },
};

export default config;
