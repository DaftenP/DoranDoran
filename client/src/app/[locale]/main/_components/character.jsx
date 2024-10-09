'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDailyAll } from '@/store/quiz';
import { getLocalStorageData } from '@/store/quiz';
import Link from 'next/link';
import Image from 'next/image'
import MyCharacter from '@/components/character/character'
import MainButton from '@/public/icon2/main-button.webp'

export default function Character() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale()

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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDailyAll()); // 남은 문제 수만큼 문제 가져오기
  }, [dispatch]);

  const t = useTranslations('index');
  const router = useRouter();
  const localData = getLocalStorageData('dailyQuizData');
  const quizList = localData ? localData.data : []; // localData가 null인 경우 빈 배열로 초기화

  const user = useSelector((state) => state.user)

  const equipment = user.profile.equipment
  const color = user.profile.color

  const renderHat = () => {
    switch (equipment) {
      case 1:
        return <Image src={Hat1} alt="hat_icon" className="absolute transform -translate-y-[1vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      case 2:
        return <Image src={Hat2} alt="hat_icon" className="absolute transform -translate-y-[1vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      case 3:
        return <Image src={Hat3} alt="hat_icon" className="absolute transform -translate-y-[2.5vh] translate-x-[14.5vh] w-[12vh] h-[8vh] z-30" />;
      case 4:
        return <Image src={Hat4} alt="hat_icon" className="absolute transform scale-x-[-1] -translate-y-[1.5vh] translate-x-[12vh] w-auto h-[8vh] z-30" />;
      case 5:
        return <Image src={Hat5} alt="hat_icon" className="absolute transform scale-x-[-1] -translate-y-[1.5vh] translate-x-[9vh] w-auto h-[9vh] z-30" />;
      case 6:
        return <Image src={Hat6} alt="hat_icon" className="absolute transform scale-x-[-1] -translate-y-[2.8vh] translate-x-[14vh] w-auto h-[9vh] z-30" />;
      case 7:
        return <Image src={Hat7} alt="hat_icon" className="absolute transform -translate-y-[2vh] translate-x-[12vh] w-auto h-[9vh] z-30" />;
      case 8:
        return <Image src={Hat8} alt="hat_icon" className="absolute transform -translate-y-[2vh] translate-x-[10vh] w-auto h-[9vh] z-30" />;
      case 9:
        return <Image src={Hat9} alt="hat_icon" className="absolute transform -translate-y-[0.2vh] translate-x-[12vh] w-auto h-[7vh] z-30" />;
      case 10:
        return <Image src={Hat10} alt="hat_icon" className="absolute transform -translate-y-[0.2vh] translate-x-[12.5vh] w-[15vh] h-[8vh] z-30" />;
      case 11:
        return <Image src={Hat11} alt="hat_icon" className="absolute transform -translate-y-[2.5vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      case 12:
        return <Image src={Hat12} alt="hat_icon" className="absolute transform -translate-y-[1vh] translate-x-[12vh] w-auto h-[8vh] z-30" />;
      case 13:
        return <Image src={Hat13} alt="hat_icon" className="absolute transform scale-x-[-1] -translate-y-[3vh] translate-x-[11vh] w-auto h-[9vh] z-30" />;
      case 14:
        return <Image src={Hat14} alt="hat_icon" className="absolute transform -translate-y-[2.5vh] translate-x-[14.5vh] w-[12vh] h-[8vh] z-30" />;
      case 15:
        return <Image src={Hat15} alt="hat_icon" className="absolute transform -translate-y-[2vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      default:
        return null;
    }
  }

  const renderBird = () => {
    switch (color) {
      case 7:
        return <Image src={Bird1} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 2:
        return <Image src={Bird2} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 3:
        return <Image src={Bird3} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 4:
        return <Image src={Bird4} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 5:
        return <Image src={Bird5} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 6:
        return <Image src={Bird6} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 1:
        return <Image src={Bird7} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 8:
        return <Image src={Bird8} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 9:
        return <Image src={Bird9} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 10:
        return <Image src={Bird10} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      case 11:
        return <Image src={Bird11} alt="bird_and_dressing_room" className="relative w-auto h-[29vh] z-20" />;
      default:
        return null;
    }
  }

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
