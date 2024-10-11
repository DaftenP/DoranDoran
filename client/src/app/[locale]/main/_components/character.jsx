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
import MainButton2 from '@/public/icon2/main-button2.webp'
import Modal from '@/components/modal/modal';

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
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)
  const [isWobbling, setIsWobbling] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [randomText, setRandomText] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWobbling(true);

      const randomText = Math.floor(Math.random() * textArray.length)
      setRandomText(randomText)
      setIsVisible(true)

      setTimeout(() => {
        setIsWobbling(false);
      }, 1000);

      setTimeout(() => {
        setIsVisible(false);
      }, 4000);

    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const triggerAnimation = () => {
    setIsWobbling(true);

    const randomTextIndex = Math.floor(Math.random() * textArray.length);
    setRandomText(randomTextIndex);
    setIsVisible(true);

    setTimeout(() => {
      setIsWobbling(false);
    }, 1000);

    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  };

  const handleCharacterClick = () => {
    triggerAnimation();
  };

  const handleYesClick = (buttonLink) => {
    setIsOpenModal(false)
    if (buttonLink === 'main') {
      router.push(`/${countryCode}/main`)
    }
  }

  const handleOpenModal = (messageIndex) => {
    setModalMessage(modalMessages[messageIndex])
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
  }

  const modalMessages = [
    // 데일리 미션 다 깼다는 메세지
    {
      'message': "you-have-cleared-today's-mission",
      'background': 'bird',
      'buttonLink': 'main',
      'buttonType': 2
    },
  ]

  useEffect(() => {
    dispatch(fetchDailyAll()); // 남은 문제 수만큼 문제 가져오기
  }, [dispatch]);

  const t = useTranslations('index');
  const router = useRouter();
  const localData = getLocalStorageData('dailyQuizData');
  const quizList = localData ? localData.data : []; // localData가 null인 경우 빈 배열로 초기화

  const user = useSelector((state) => state.user)

  const daily = user.mission.dailyStatus

  const handleFastQuiz = () => {
    if (daily === 10) {
      handleOpenModal(0)
    } else {
      if(quizList.length > 0) {
        router.push(`/${locale}/study/daily/${quizList[0].quizId}`);
      }
    }
  };

  const textArray = [
    "do-you-have-anything-to-do-right-now",
    "yesterday-i-ate-some-fruit-it-was-really-good",
    "how-is-the-weather-today-im-curious-about-the-sky",
    "what-should-we-do-now-just-wondering",
    "whats-your-favorite-number",
    "guess-what-im-thinking-right-now",
    "did-something-just-pass-by",
    "do-you-prefer-day-or-night",
    "im-feeling-a-bit-sleepy-am-i-the-only-one",
    "did-you-hear-that-sound",
    "what-did-you-have-for-lunch-today-im-craving-fruit",
    "i-like-this-moment-just-because",
    "what-have-you-been-thinking-about-lately",
    "whats-your-favorite-color-i-like-blue",
    "im-just-staring-into-space-doing-nothing-what-about-you",
    "what-would-be-fun-to-do-right-now",
    "i-feel-like-im-forgetting-something",
    "it-feels-nice-to-just-be-still-right-now",
    "when-was-the-last-time-you-laughed",
    "do-you-know-any-good-stories"
  ];

  return (
    <div className='flex items-center justify-center mt-[3vh]'>
      <div className='relative'>
        <div className={`relative transform translate-x-[30vw] rounded-full w-[60vw] h-[12vh] bg-[#FFFFFF]/80 flex justify-center items-center text-md md:text-3xl lg:text-4xl transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} p-[5vw] border border-gray-300 shadow-md z-10`}>
          <div className='text-center'>
            {t(textArray[randomText])}
          </div> 
        </div>
        <div className='flex flex-col'>
          <div className='relative flex items-center justify-center w-[100vw] bottom-5 md:bottom-9'>
          <div onClick={handleCharacterClick} className={isWobbling ? 'animate-wobble' : ''}>
            <div className="relative pointer-events-none z-0">
              <MyCharacter />
            </div>
          </div>
          </div>
          <Image src={MainButton2} alt="main_button" className="absolute top-3/4 left-1/2 transform -translate-x-1/2 mt-[-2vh] h-[35vh] w-auto md:h-auto md:w-[65vw] md:mt-[-3.5vh]" />
          <div onClick={handleFastQuiz} className="absolute top-3/4 left-1/2 transform -translate-x-1/2 mt-[7vh] h-[10vh] w-[50vw] md:h-[12vh] md:w-[40vw] md:mt-[7vh]"></div>
        </div>
      </div>
      {isOpenModal && 
      <div className='relataive z-[1000]'>
        <Modal handleYesClick={handleYesClick} handleCloseModal={handleCloseModal} message={modalMessage} />
      </div>
      }
    </div>
  );
}
