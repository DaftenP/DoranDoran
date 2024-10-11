import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['en', 'ko', 'ru', 'ja', 'zh'], // 지원 언어
    defaultLocale: 'en' // 기본 언어
});

export const config = {
    matcher: ['/', '/(en|ko|ru|ja|zh)/:path*']
};