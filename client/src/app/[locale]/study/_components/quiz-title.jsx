'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStageDetail } from '@/store/quiz';
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
  const dispatch = useDispatch();

  const t = useTranslations('index');
  // const quizList = useSelector((state) => 
  //   type === 'daily' ? state.quiz.dailyQuizList : state.quiz.stageList[index].quizList
  // );
  
  // useEffect(() => {
  //   console.log("Stage ID:", index); // index 값 확인
  //   dispatch(fetchStageDetail(1)); 
  // }, [dispatch]);
  

  const quizList = useSelector((state) => 
    type === 'daily' ? state.quiz.dailyQuiz.data : state.quiz.stageDetail
  );
  const quizTitle = quizList[0]?.quizQuestion;
  // console.log(quizList,2)

  // const quizTitle = quizList.length > 0 ? quizList[0].title : ''

  return (
    <div>
      <div className='flex-col flex justify-center items-center text-center'>
        <div className='p-[10%] text-lg md:text-2xl lg:text-4xl'>
          {quizTitle}
        </div>
        {/* <div className='text-4xl md:text-6xl lg:text-8xl text-center'>
          {quizSubtitle}
        </div> */}
      </div>
    </div>
  );
}