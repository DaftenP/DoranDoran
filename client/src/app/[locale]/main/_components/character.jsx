'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image'
import Bird from '@/public/shop-bird/bird (1).webp'
import MainButton from '@/public/icon2/main-button.webp'

export default function Character() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale()

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
      <TranslatedCharacter locale={locale} />
    </NextIntlClientProvider>
  );
}

function TranslatedCharacter({ locale }) {
  const t = useTranslations('index');
  const router = useRouter()
  const quizList = useSelector((state) => state.quiz.quizList[0].quizList)

  const handleFastQuiz = (() => {
    router.push(`/${locale}/study/daily/${quizList[0].number}`)
  })

  return (
    <div className='flex items-center justify-center mt-[3vh]'>
      <div className='relative'>
        <div className='transform translate-x-[18vw] rounded-full w-[35vw] h-[9vh] bg-[#FFFFFF]/80 flex-col flex justify-center items-center text-md md:text-3xl lg:text-5xl'>
          {t("today's-topic")}
          <br />
          <div>
            Animal
          </div>
        </div>
        <div className="transform translate-x-[32vw] w-0 h-0 border-l-[3vw] border-r-[3vw] border-t-[3vw] border-l-transparent border-r-transparent border-t-white/80"></div>
        <Link href={`/${locale}/room`}>
          <Image src={Bird} alt="bird_and_dressing_room" className="relative w-auto h-[29vh]  z-20" />  
        </Link>
        <Image src={MainButton} alt="main_button" className="absolute top-[35.5vh] w-[60vw] h-[30vh]" />
        <div
          onClick={handleFastQuiz}
          className="absolute top-[45.5vh] left-1/2 text-center text-white text-5xl md:text-7xl lg:text-8xl"
          style={{ transform: 'translateX(-45%)' }}
        >
          {t('play')}
        </div>
      </div>
    </div>
  );
}
