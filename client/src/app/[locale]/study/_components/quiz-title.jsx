'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStageDetail } from '@/store/quiz';
import { getLocalStorageData } from '@/store/quiz';
import { getLocalStageData } from '@/store/quiz';
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
      <TranslatedQuizTitle type={type} index={index}/>
    </NextIntlClientProvider>
  );
}

function TranslatedQuizTitle({ type, index }) {
  const t = useTranslations('index');
  // const localData = getLocalStorageData('dailyQuizData');

  // const quizList = useSelector((state) => 
  //   type === 'daily' ? localData.data : state.quiz.stageDetail.data
  // );

  const quizList = type === 'daily' 
                  ? (getLocalStorageData('dailyQuizData')?.data || [])  // dailyQuizData가 없으면 빈 배열 반환
                  : (getLocalStageData(index + 1)?.data || []);  // 해당 스테이지 데이터가 없으면 빈 배열 반환


  const quizTitle = quizList[0]?.quizQuestion;

  return (
    <div className='flex-col flex justify-center items-center text-center'>
      <div className='p-[5%] text-lg md:text-2xl lg:text-4xl'>
        {quizTitle}
      </div>
    </div>
  );
}