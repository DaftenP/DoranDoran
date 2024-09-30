'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteQuiz, backQuiz, deleteStage } from '@/store/quiz';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Button({ type, index }) {
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
      <TranslatedButton locale={locale} type={type} index={index}/>
    </NextIntlClientProvider>
  );
}

function TranslatedButton({ locale, type, index }) {
  const t = useTranslations('index');
  const dispatch = useDispatch();
  const router = useRouter();
  const quizList = useSelector((state) => 
    type === 'daily' ? state.quiz.dailyQuizList : state.quiz.stageList[index].quizList
  );

  // const handleSubmit = (() => {
  //   if (type === 'daily') {
  //     dispatch(deleteQuiz());
  //   } else {
  //     dispatch(deleteStage());
  //   }
  // });

  const handleSubmit = () => {
    dispatch(deleteQuiz());
  }

  useEffect(() => {
    if (type === 'daily') {
      if (quizList.length > 0) {
        router.push(`/${locale}/study/daily/${quizList[0].quizId}`)
      } else {
        router.push(`/${locale}/main`)
      }
    }
    else {
      if (quizList.length > 0) {
        router.push(`/${locale}/study/detail/${index+1}/${quizList[0].quizId}`)
      } else {
        router.push(`/${locale}/main`)
      }
    }
  }, [quizList]);

  return (
    <div>
      <div className='flex-col flex justify-center items-center'>
        <button onClick={handleSubmit} className='w-[50vw] h-[10vh] bg-blue-300 text-4xl md:text-6xl lg:text-8xl'>Submit</button>
      </div>
    </div>
  );
}