'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function Button({ type, index }) {
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
      <TranslatedButton locale={locale} type={type} index={index}/>
    </NextIntlClientProvider>
  );
}

function TranslatedButton({ locale, type, index }) {
  const t = useTranslations('index');
  const router = useRouter();
  const quizList = useSelector((state) => 
    type === 'daily' ? state.quiz.dailyQuiz.data : state.quiz.stageDetail.data
  );

  return (
    <div>
      <div className='flex-col flex justify-center items-center'>
        <button className='bg-[#000150] text-[#FFFFF0] text-2xl md:text-3xl lg:text-4xl rounded-full pl-5 pr-5 pt-1 pb-1'>Submit</button>
      </div>
    </div>
  );
}