// import withPWAInit from "@ducanh2912/next-pwa";
// import createNextIntlPlugin from 'next-intl/plugin';

// const withNextIntl = createNextIntlPlugin();

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false, // Strict Mode 비활성화
// };

// const withPWAInitConfig = withPWAInit({
//   dest: 'public', // PWA 관련 파일들이 생성될 디렉토리를 지정
//   disable: process.env.NODE_ENV === 'development', // 개발 환경에서 PWA 비활성화
//   // disable: false, // PWA를 항상 활성화
//   register: true, // 서비스 워커 자동 등록
//   skipWaiting: true, // PWA 업데이트 즉시 적용
// });

// export default withNextIntl(withPWAInitConfig(nextConfig));

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Strict Mode 비활성화
  images: {
    domains: ['ssafy-tailored.b-cdn.net'],
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);