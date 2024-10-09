'use client';

import Image from "next/image";
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStageDetail } from '@/store/quiz';
import { getLocalStageData } from '@/store/quiz';
import QuizTitle from '@/app/[locale]/study/_components/quiz-title'
import QuizContent from '@/app/[locale]/study/_components/quiz-content';
import Play from "@/public/icon/play1.webp";
import { useRouter } from 'next/navigation';
import { markStageAsCompleted } from '@/store/quiz';

export default function Quiz({type, index}) {
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
      <TranslatedQuiz locale={locale} type={type} index={index}/>
    </NextIntlClientProvider>
  );
}

function TranslatedQuiz({locale, type, index}) {
  const t = useTranslations('index');
  const dispatch = useDispatch();
  const [localData, setLocalData] = useState(getLocalStageData(index+1));

  useEffect(() => {
    const updateLocalData = () => {
      const newData = getLocalStageData(index+1);
      // 기존 데이터와 비교하여 변경되었을 때만 상태를 업데이트
      if (JSON.stringify(localData) !== JSON.stringify(newData)) {
        setLocalData(newData);
      }
    };

    const intervalId = setInterval(updateLocalData, 500); // 0.5초마다 업데이트 확인

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 클리어
  }, [localData]);

  const quizList = localData ? localData.data : [];

  const stageData = useSelector((state) => state.quiz.stage.data);
  // const quizList = useSelector((state) => state.quiz.stageDetail.data);
  // console.log('quizList:',quizList);
  
  const stageOrder = stageData[index]?.order;
  const quizType = quizList[0]?.quizType;
  const totalQuizzes = quizList.length;
  const quizVoiceUrl = quizList[0]?.quizVoiceUrl;
  const router = useRouter();

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
    // if (index) {
      dispatch(fetchStageDetail(index+1)); // Fetch the stage detail using the ID
      if (!quizList.length) {
        markStageAsCompleted(stageOrder);
        router.push(`/${locale}/study`)
      }
    // }
  }, [dispatch, index, quizList]);

  // useEffect(() => {
  //   if (!quizList.length) {
  //     router.push(`/${locale}/study`)
  //   }
  // }, [quizList]);

  return (
    <div className='relative h-[80vh]'>
      <div className='mb-[10vh]'>
        <div className='text-center text-3xl md:text-4xl lg:text-6xl'>
          Stage-{stageOrder}
        </div>
        <div className='text-center text-xl md:text-2xl lg:text-4xl'>
          {/* {`[${1}/${totalQuizzes}]`}  */}
          남은 퀴즈 수 :  {totalQuizzes}
        </div>
        <QuizTitle type={type} index={index}/>
      </div>
        <button onClick={playVoice} className='absolute z-10 top-[82%] left-[50%] transform -translate-x-1/2 flex-col flex justify-center items-center w-[30vw] h-[10vh]'>
          <Image
            src={Play}
            alt="play"
            className="w-[30%] h-auto" // CSS에서 비율을 맞추기 위해 w와 h를 설정
          />
        </button>
      <div className='absolute top-[30%] w-[100%] h-[75%] left-1/2 transform -translate-x-1/2'>
        <QuizContent type={type} index={index}/>
      </div>
    </div>
  );
}