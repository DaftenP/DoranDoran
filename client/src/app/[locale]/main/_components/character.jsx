'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDailyAll } from '@/store/quiz';
import Link from 'next/link';
import Image from 'next/image'

import MainButton from '@/public/icon2/main-button.webp'

export default function Character() {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState(null);
  const locale = useLocale()

  useEffect(() => {
    dispatch(fetchDailyAll()); // 컴포넌트가 마운트될 때 stage 데이터 가져오기
  }, [dispatch]);

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
  const quizList = useSelector((state) => state.quiz.dailyQuiz.data);
  const user = useSelector((state) => state.user)

  const equipment = user.profile.equipment
  const color = user.profile.color

  const renderHat = () => {
    switch (equipment) {
      case 1:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/1.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[1vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      case 2:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/2.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[1vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      case 3:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/3.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2.5vh] translate-x-[14.5vh] w-[12vh] h-[8vh] z-30" />;
      case 4:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/4.webp"} alt="hat_icon" width={200} height={100} className="absolute transform scale-x-[-1] -translate-y-[1.5vh] translate-x-[12vh] w-auto h-[8vh] z-30" />;
      case 5:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/5.webp"} alt="hat_icon" width={200} height={100} className="absolute transform scale-x-[-1] -translate-y-[1.5vh] translate-x-[9vh] w-auto h-[9vh] z-30" />;
      case 6:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/6.webp"} alt="hat_icon" width={200} height={100} className="absolute transform scale-x-[-1] -translate-y-[2.8vh] translate-x-[14vh] w-auto h-[9vh] z-30" />;
      case 7:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/7.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2vh] translate-x-[12vh] w-auto h-[9vh] z-30" />;
      case 8:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/8.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2vh] translate-x-[10vh] w-auto h-[9vh] z-30" />;
      case 9:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/9.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[0.2vh] translate-x-[12vh] w-auto h-[7vh] z-30" />;
      case 10:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/10.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[0.2vh] translate-x-[12.5vh] w-[15vh] h-[8vh] z-30" />;
      case 11:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/11.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2.5vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      case 12:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/12.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[1vh] translate-x-[12vh] w-auto h-[8vh] z-30" />;
      case 13:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/13.webp"} alt="hat_icon" width={200} height={100} className="absolute transform scale-x-[-1] -translate-y-[3vh] translate-x-[11vh] w-auto h-[9vh] z-30" />;
      case 14:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/14.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2.5vh] translate-x-[14.5vh] w-[12vh] h-[8vh] z-30" />;
      case 15:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/hat/15.webp"} alt="hat_icon" width={200} height={100} className="absolute transform -translate-y-[2vh] translate-x-[13vh] w-auto h-[9vh] z-30" />;
      default:
        return null;
    }
  }

  const renderBird = () => {
    switch (color) {
      case 1:
        return <Image src={`https://ssafy-tailored.b-cdn.net/shop/bird/1.webp`} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 2:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/2.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 3:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/3.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 4:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/4.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 5:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/5.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 6:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/6.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 7:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/7.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 8:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/8.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 9:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/9.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 10:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/10.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
      case 11:
        return <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/11.webp"} alt="bird_and_dressing_room" width={200} height={100} className="relative w-auto h-[29vh] z-20" />;
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
        {renderHat()}
        <Link href={`/${locale}/room`}>
          {renderBird()}  
        </Link>
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
