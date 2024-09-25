'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteQuiz, backQuiz } from '@/store/quiz';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Button() {
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
      <TranslatedButton locale={locale} />
    </NextIntlClientProvider>
  );
}

function TranslatedButton({ locale }) {
  const t = useTranslations('index');
  const quizList = useSelector((state) => state.quiz.quizList[0].quizList)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSubmit = (() => {
    dispatch(deleteQuiz())
  })

  useEffect(() => {
    if (quizList.length > 0) {
      router.push(`/${locale}/study/daily/${quizList[0].number}`)
    } else {
      router.push(`/${locale}/main`)
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