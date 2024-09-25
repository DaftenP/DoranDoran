'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

export default function QuizContent() {
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
      <TranslatedQuizContent />
    </NextIntlClientProvider>
  );
}

function TranslatedQuizContent() {
  const t = useTranslations('index');
  const quizList = useSelector((state) => state.quiz.quizList[0].quizList)

  const quizContent = quizList.length > 0 ? quizList[0].content : ''

  return (
    <div>
      <div className='flex-col flex justify-center items-center'>
        <div className='text-xxl md:text-4xl lg:text-6xl'>
          {quizContent}
          <br />
          {quizContent}
          <br />
          {quizContent}
          <br />
          {quizContent}
        </div>
      </div>
    </div>
  );
}