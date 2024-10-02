'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

export default function QuizTitle({ type, index }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

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
      <TranslatedQuizTitle type={type} index={index}/>
    </NextIntlClientProvider>
  );
}

function TranslatedQuizTitle({ type, index }) {
  const t = useTranslations('index');
  const quizList = useSelector((state) => 
    type === 'daily' ? state.quiz.dailyQuizList : state.quiz.stageList[index].quizList
  );

  const quizTitle = quizList.length > 0 ? quizList[0].title : ''

  return (
    <div>
      <div className='flex-col flex justify-center items-center'>
        <div className='text-xxl md:text-4xl lg:text-6xl'>
          {quizTitle}
        </div>
        {/* <div className='text-4xl md:text-6xl lg:text-8xl text-center'>
          {quizSubtitle}
        </div> */}
      </div>
    </div>
  );
}