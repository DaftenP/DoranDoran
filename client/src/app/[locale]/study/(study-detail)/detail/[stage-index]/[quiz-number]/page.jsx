'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import QuizDetail from '@/app/[locale]/study/_components/quiz-detail';

export default function DetailQuiz({ params }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  const index = params['stage-index']-1;

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
      <TranslatedDetailQuiz index ={index}/>
    </NextIntlClientProvider>
  );
}

function TranslatedDetailQuiz({ index }) {
  const t = useTranslations('index');

  return (
    <div>
      <QuizDetail type={'stage'} index={index}/>
    </div>
  );
}