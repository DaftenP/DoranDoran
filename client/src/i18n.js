import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'ko', 'ja', 'ru', 'zh'];

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale)) notFound();

    // 위치 확인
    return {
        messages: (await import(`../messages/${locale}.json`)).default 
    };
});
