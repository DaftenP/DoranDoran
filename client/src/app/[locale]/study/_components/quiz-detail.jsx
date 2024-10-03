'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStageDetail } from '@/store/quiz';
import Link from 'next/link';
import QuizTitle from '@/app/[locale]/study/_components/quiz-title'
import QuizContent from '@/app/[locale]/study/_components/quiz-content';
import Button from '@/app/[locale]/study/_components/button';

export default function Quiz({type, index}) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    dispatch(fetchStageDetail()); // 컴포넌트가 마운트될 때 stage 데이터 가져오기
  }, [dispatch]);

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
      <TranslatedQuiz type={type} index={index}/>
    </NextIntlClientProvider>
  );
}

function TranslatedQuiz({type, index}) {
  const t = useTranslations('index');

  return (
    <div className='relative h-[80vh]'>
      <div className='mb-[10vh]'>
        <QuizTitle type={type} index={index}/>
      </div>
      <QuizContent type={type} index={index}/>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2'>
        {/* <Button type={type} index={index}/> */}
      </div>
    </div>
  );
}