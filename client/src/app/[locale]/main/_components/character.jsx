'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDailyAll } from '@/store/quiz';
import Image from 'next/image'
import MyCharacter from '@/components/character/character'
import MainButton from '@/public/icon2/main-button.webp'

export default function Character() {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState(null);
  const locale = useLocale()

  useEffect(() => {
    dispatch(fetchDailyAll());
  }, [dispatch]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {}
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedCharacter locale={locale} />
    </NextIntlClientProvider>
  );
}

function TranslatedCharacter({ locale }) {
  const t = useTranslations('index');
  const router = useRouter();
  const quizList = useSelector((state) => state.quiz.dailyQuiz.data);

  const handleFastQuiz = () => {
    if(quizList.length > 0) {
      router.push(`/${locale}/study/daily/${quizList[0].quizId}`);
    }
  };

  return (
    <div className='flex items-center justify-center mt-[3vh]'>
      <div className='relative'>
        <div className='transform translate-x-[18vw] rounded-full w-[35vw] h-[9vh] bg-[#FFFFFF]/80 flex-col flex justify-center items-center text-md md:text-3xl lg:text-5xl'>
          {t("today's-topic")}
          <br />
          <div>
            {t("animal")}
          </div>
        </div>
        <div className="transform translate-x-[32vw] w-0 h-0 border-l-[3vw] border-r-[3vw] border-t-[3vw] border-l-transparent border-r-transparent border-t-white/80"></div>
        <div className='relative bottom-5 md:bottom-9'>
        <MyCharacter/>
        </div>
        <Image src={MainButton} alt="main_button" className="absolute top-[35.5vh] w-[60vw] h-[30vh]" />
        <div
          onClick={handleFastQuiz}
          className="absolute top-[45.5vh] left-1/2 text-center text-white text-5xl md:text-7xl lg:text-8xl"
          style={{ transform: 'translateX(-45%)' }}
        >
          Play
        </div>
      </div>
    </div>
  );
}
