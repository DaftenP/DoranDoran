'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Top from '@/components/top/top';
import Bottom from '@/components/bottom/bottom';
import TopicList from '@/app/[locale]/ai-tutor/_components/topic-list';

export default function TopicSelect({ params }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        // console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedTopicSelect params={params} />
    </NextIntlClientProvider>
  );
}

function TranslatedTopicSelect({ params }) {
  const t = useTranslations('index');
  const locale = useLocale()

  return (
    <div>
      <Top />
      <div className='flex-col flex justify-center items-center' style={{ marginTop: '8.5vh', marginBottom: '12vh' }}>
        <div className='flex-col flex justify-center items-center'>
          <div className='text-xxl md:text-4xl lg:text-6xl'>
            {t("ai-tutor")}
          </div>
          <div className='text-4xl md:text-6xl lg:text-8xl'>
            {t("topic-selection")}
          </div>
          <div className='text-xl md:text-4xl lg:text-6xl text-center'>
            {t("what-topic-would-you-like-to-talk-about")}
          </div>
          <div>
          <Link href={`/${locale}/ai-tutor`}>
            <button className="text-white bg-[#4A90E2] rounded-xl text-md md:text-2xl lg:text-3xl px-6 py-1 cursor-pointer shadow-md hover:bg-[#357ABD] transition-colors duration-300 ease-in-out">
              {t('before')}
            </button>
          </Link>
          </div>
        </div>
        <div className="rounded-3xl min-w-[30vw] max-w-[90vw] min-h-[40vh] max-h-[58vh] bg-[#FFF5E1]/70 p-[2.5vh] mt-[1vh] overflow-y-scroll hide-scrollbar">
          <TopicList params={params}/>
        </div>
      </div>
      <Bottom />
    </div>
  );
}
