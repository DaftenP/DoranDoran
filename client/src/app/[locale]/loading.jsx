'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import BackgroundDay from '@/public/background/day.webp'
import Bird1 from '@/public/logo/doryeoni.webp'
import Bird2 from '@/public/logo/raoni.webp'
import { CircularProgressbarWithChildren, CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Loading() {
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
      <TranslatedLoading />
    </NextIntlClientProvider>
  );
}

function TranslatedLoading() {
  const t = useTranslations('index');
  const [progress, setProgress] = useState(0);
  const [bird1Position, setBird1Position] = useState(-30);
  const [bird2Position, setBird2Position] = useState(-30);
  const [randomText, setRandomText] = useState('')

  const randomTips = [
    "there-are-formal-and-informal-speech-levels-in-korean-use-them-appropriately-depending-on-the-situation",
    "'thank-you'-is-often-used-as-an-expression-of-gratitude",
    "if-you-study-steadily-for-5-minutes-a-day-you-will-get-used-to-korean-more-easily",
    "repetitive-learning-is-very-helpful-in-remembering-a-language",
    "when-memorizing-new-words-try-remembering-example-sentences-too",
    "in-korea-people-say-'잘-먹겠습니다'-before-starting-a-meal",
    "try-learning-korean-naturally-through-dramas-and-music",
    "during-holidays-families-perform-'세배'-and-exchange-well-wishing-words",
    "small-achievements-add-up-to-big-progress",
    "today's-small-actions-lead-to-tomorrow's-fluency",
    "it-is-okay-to-go-slowly-consistency-is-what-matters"
  ]
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * randomTips.length)
    setRandomText(randomTips[randomIndex])
  }, [])

  const duration = 10000; // 전체 애니메이션 시간 (밀리초)

  useEffect(() => {
    let start = null;
    let frame;

    const animateProgress = (timestamp) => {
      if (!start) start = timestamp;
      const progressTime = timestamp - start;

      const percentage = Math.min((progressTime / duration) * 100, 100); // 0~100% 사이의 값 계산
      setProgress(percentage);

      if (percentage < 100) {
        frame = requestAnimationFrame(animateProgress);
      } else {
        setTimeout(() => {
          start = null; // 100%에 도달하면 잠시 멈추고 다시 시작
          frame = requestAnimationFrame(animateProgress);
        }, 1000);
      }
    };

    frame = requestAnimationFrame(animateProgress);

    return () => cancelAnimationFrame(frame); // 컴포넌트가 언마운트될 때 애니메이션 정지
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBird1Position((prev) => (prev >= 130 ? -90 : prev + 1)); // 끝까지 가면 다시 시작
      setBird2Position((prev) => (prev >= 130 ? -90 : prev + 0.7));
    }, 30); // 30ms마다 1씩 업데이트

    return () => clearInterval(interval); // 컴포넌트 unmount 시 interval 제거
  }, []);

  return (
    <div className='relative flex justify-center items-center'>
      <Image src={Bird2} alt='bird2'
        className='w-[30vw] h-auto z-10'
        style={{ transform: `translateX(${-bird2Position}vw) translateY(5vh)` }}
      />
      <Image src={Bird1} alt='bird1'
        className='w-[20vw] h-auto z-10'
        style={{ transform: `translateX(${bird1Position}vw) translateY(15vh)` }}
      />
      <Image src={BackgroundDay} alt='background_day' className='fixed top-0 z-0 w-full h-full'/>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[40vh] h-[40vh] md:w-[55vh] md:h-[55vh]'>
        <CircularProgressbarWithChildren
          value={progress}
          strokeWidth={5}
          styles={buildStyles({
            pathColor: '#B785E8', // 로딩바 색상
            trailColor: 'transparent', // 트레일 색상
          })}
        >
          <div className='flex justify-center items-center text-3xl md:text-6xl lg:text-8xl'>
            - {t('tip')} -
          </div>
          <div className='text-center w-[30vh] text-xxl md:text-4xl lg:text-5xl break-words overflow-wrap'>
            {t(randomText)}
          </div>
        </CircularProgressbarWithChildren>
      </div>
    </div>
  );
}
