import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(); // next-intl 플러그인 생성

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Strict Mode 비활성화
  images: {
    domains: ['ssafy-tailored.b-cdn.net'], // 이미지를 허용할 도메인 설정
    unoptimized: true, // 이미지 최적화 비활성화
  },
};

export default withNextIntl(nextConfig);