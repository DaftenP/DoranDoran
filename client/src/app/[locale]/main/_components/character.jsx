'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image'
import Bird from '@/public/shop-bird/bird (1).webp'
import Hat1 from '@/public/shop-hat/hat (1).webp';
import Hat2 from '@/public/shop-hat/hat (2).webp';
import Hat3 from '@/public/shop-hat/hat (3).webp';
import Hat4 from '@/public/shop-hat/hat (4).webp';
import Hat5 from '@/public/shop-hat/hat (5).webp';
import Hat6 from '@/public/shop-hat/hat (6).webp';
import Hat7 from '@/public/shop-hat/hat (7).webp';
import Hat8 from '@/public/shop-hat/hat (8).webp';
import Hat9 from '@/public/shop-hat/hat (9).webp';
import Hat10 from '@/public/shop-hat/hat (10).webp';
import Hat11 from '@/public/shop-hat/hat (11).webp';
import Hat12 from '@/public/shop-hat/hat (12).webp';
import Hat13 from '@/public/shop-hat/hat (13).webp';
import Hat14 from '@/public/shop-hat/hat (14).webp';
import Hat15 from '@/public/shop-hat/hat (15).webp';

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
  const router = useRouter();
  const quizList = useSelector((state) => state.quiz.dailyQuizList);

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
            {/* {t("animal")} */}
            animal
          </div>
        </div>
        <div className="transform translate-x-[32vw] w-0 h-0 border-l-[3vw] border-r-[3vw] border-t-[3vw] border-l-transparent border-r-transparent border-t-white/80"></div>
        {/* <Image src={Hat1} alt="hat_icon" className="absolute transform -translate-y-[1vh] translate-x-[13vh] w-auto h-[9vh] z-30" />   */}
        {/* <Image src={Hat2} alt="hat_icon" className="absolute transform -translate-y-[1vh] translate-x-[13vh] w-auto h-[9vh] z-30" />   */}
        {/* <Image src={Hat3} alt="hat_icon" className="absolute transform -translate-y-[2.5vh] translate-x-[14.5vh] w-[12vh] h-[8vh] z-30" />   */}
        {/* <Image src={Hat4} alt="hat_icon" className="absolute transform scale-x-[-1] -translate-y-[1.5vh] translate-x-[12vh] w-auto h-[8vh] z-30" />   */}
        {/* <Image src={Hat5} alt="hat_icon" className="absolute transform scale-x-[-1] -translate-y-[1.5vh] translate-x-[9vh] w-auto h-[9vh] z-30" />   */}
        {/* <Image src={Hat6} alt="hat_icon" className="absolute transform scale-x-[-1] -translate-y-[2.8vh] translate-x-[14vh] w-auto h-[9vh] z-30" />   */}
        {/* <Image src={Hat7} alt="hat_icon" className="absolute transform -translate-y-[2vh] translate-x-[12vh] w-auto h-[9vh] z-30" />   */}
        {/* <Image src={Hat8} alt="hat_icon" className="absolute transform -translate-y-[2vh] translate-x-[10vh] w-auto h-[9vh] z-30" />   */}
        {/* <Image src={Hat9} alt="hat_icon" className="absolute transform -translate-y-[0.2vh] translate-x-[12vh] w-auto h-[7vh] z-30" />   */}
        {/* <Image src={Hat10} alt="hat_icon" className="absolute transform -translate-y-[0.2vh] translate-x-[12.5vh] w-[15vh] h-[8vh] z-30" />   */}
        {/* <Image src={Hat11} alt="hat_icon" className="absolute transform -translate-y-[2.5vh] translate-x-[13vh] w-auto h-[9vh] z-30" />   */}
        {/* <Image src={Hat12} alt="hat_icon" className="absolute transform -translate-y-[1vh] translate-x-[12vh] w-auto h-[8vh] z-30" />   */}
        {/* <Image src={Hat13} alt="hat_icon" className="absolute transform scale-x-[-1] -translate-y-[3vh] translate-x-[11vh] w-auto h-[9vh] z-30" />   */}
        {/* <Image src={Hat14} alt="hat_icon" className="absolute transform -translate-y-[2.5vh] translate-x-[14.5vh] w-[12vh] h-[8vh] z-30" />   */}
        {/* <Image src={Hat15} alt="hat_icon" className="absolute transform -translate-y-[2vh] translate-x-[13vh] w-auto h-[9vh] z-30" />   */}
        <Link href={`/${locale}/room`}>
          <Image src={Bird} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />  
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
