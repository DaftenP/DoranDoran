'use client';

import Image from "next/image";
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDailyAll } from '@/store/quiz';
import Link from 'next/link';
import QuizTitle from '@/app/[locale]/study/_components/quiz-title'
import QuizContent from '@/app/[locale]/study/_components/quiz-content';
import Button from '@/app/[locale]/study/_components/button';
import Play from "@/public/icon/play1.webp";
import { useRouter } from 'next/navigation';

export default function QuizDaily({type}) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

  // useEffect(() => {
  //   dispatch(fetchDailyAll()); // 컴포넌트가 마운트될 때 stage 데이터 가져오기
  // }, [dispatch]);

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
      <TranslatedQuizDaily locale={locale} type={type}/>
    </NextIntlClientProvider>
  );
}

function TranslatedQuizDaily({locale, type, index}) {
  const t = useTranslations('index');
  // const quizList = useSelector((state) => state.quiz.stageDetail.data);
  const quizList = useSelector((state) => state.quiz.dailyQuiz.data);
  const quizType = quizList[0]?.quizType;
  const totalQuizzes = quizList.length;
  const quizVoiceUrl = quizList[0]?.quizVoiceUrl;
  const router = useRouter();
  // console.log(quizList)

  // 음성 재생 함수
  const playVoice = () => {
    const audio = new Audio(quizVoiceUrl);
    audio.play().catch((error) => {
      console.error('음성을 재생하는 데 오류가 발생했습니다:', error);
    });
  };

  useEffect(() => {
    playVoice();
  }, [quizVoiceUrl]);

  useEffect(() => {
    if (!quizList.length) {
      router.push(`/${locale}/main`)
    }
  }, [quizList]);

  return (
    <div className='relative h-[80vh]'>
      <div className='mb-[10vh]'>
        <div className='text-center text-3xl md:text-4xl lg:text-6xl'>
          {/* Stage-{stageOrder} */}
        </div>
        <div className='text-center text-xl md:text-2xl lg:text-4xl'>
          {/* {`[${1}/${totalQuizzes}]`}  */}
          남은 퀴즈 수 :  {totalQuizzes}
        </div>
        <QuizTitle type={type} index={index}/>
      </div>
        <button onClick={playVoice} className='absolute z-10 top-[80%] left-[50%] transform -translate-x-1/2 flex-col flex justify-center items-center w-[30vw] h-[10vh]'>
          <Image
            src={Play}
            alt="play"
            className="w-[30%] h-auto" // CSS에서 비율을 맞추기 위해 w와 h를 설정
          />
        </button>
      <div className='absolute top-[35%] w-[80%] h-[75%] left-1/2 transform -translate-x-1/2'>
        <QuizContent type={type} index={index}/>
      </div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2'>
        {/* <Button type={type} index={index}/> */}
      </div>
    </div>
  );
}