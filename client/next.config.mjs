import withPWA from 'next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {};

const withPWAConfig = withPWA({
  dest: 'public', // PWA 관련 파일들이 생성될 디렉토리를 지정
  disable: process.env.NODE_ENV === 'development', // 개발 환경에서 PWA 비활성화
  register: false, // 서비스 워커 자동 등록
  skipWaiting: true, // PWA 업데이트 즉시 적용
});

export default withNextIntl(withPWAConfig(nextConfig));