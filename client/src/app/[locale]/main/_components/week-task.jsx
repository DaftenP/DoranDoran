'use client';

import { useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import DayTask from '@/app/[locale]/main/_components/day-task'

export default function WeekTask() {
  const [messages, setMessages] = useState(null);
  const locale = 'en'; // 예시로 en 사용, 동적 처리 가능

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedWeekTask />
    </NextIntlClientProvider>
  );
}

function TranslatedWeekTask() {
  const t = useTranslations('index');

  return (
    <div className='flex-col flex items-center'>
      <div className="rounded-tl-full rounded-tr-full w-[90vw] h-[3vh] bg-[#CFF6F9] mt-[4vh] text-center text-md md:text-3xl">
        {t("week's-task")}
      </div>
      <div className="w-[90vw] h-[0.5vh] bg-[#A2F1FF]">

      </div>
      <div className="w-[90vw] h-[8vh] bg-[#CFF6F9] flex justify-center items-center">
        <div className="rounded-2xl w-[84vw] h-[6vh] bg-[#FFFFFF]/75">
          <DayTask />
        </div>
      </div>
      <div className="w-[90vw] h-[0.5vh] bg-[#A2F1FF]">

      </div>
      <div className="relative rounded-bl-full rounded-br-full w-[90vw] h-[3vh] bg-[#CFF6F9] overflow-hidden text-center shadow-xl">
        <div className="absolute top-0 left-0 w-[45vw] h-[3vh] bg-[#2FB9FE]">
          
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-sm md:text-2xl">
          5/10
        </div>
      </div>
    </div>
  );
}