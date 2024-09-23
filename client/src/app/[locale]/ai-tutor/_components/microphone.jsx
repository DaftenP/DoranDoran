'use client';

import { useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import MicrophoneNormal from '@/public/icon/microphone-normal.webp'
import MicrophoneActive from '@/public/icon/microphone-active.webp'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Microphone () {
  const [messages, setMessages] = useState(null);
  const locale = 'en'; // 예시로 en 사용, 동적 처리 가능

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
      <TranslatedMicrophone />
    </NextIntlClientProvider>
  );
}

function TranslatedMicrophone() {
  const t = useTranslations('index');
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + (100 / 30) : (setIsRunning(false), clearInterval(interval), 100))); // 30초 동안 100%로 증가
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [isRunning, progress]);

  const handleMicrophoneClick = () => {
    setIsRunning(!isRunning)
  }

  return (
    <div className='relative flex-col flex items-center justify-center'>
      <div className='w-[16vh] h-[16vh]'>
        <CircularProgressbar
          value={progress}
          strokeWidth={5}
          styles={buildStyles({
            pathColor: progress === 100 ? '#ACACAC' : `rgba(255, 0, 0, ${progress / 100})`,
            trailColor: '#ACACAC',
          })}
        />
      </div>
      {isRunning ? (
        <Image onClick={handleMicrophoneClick} src={MicrophoneActive} alt="microphone_icon" className="absolute cursor-pointer w-[13vh] h-[13vh]" />
      ) : (
        <Image onClick={handleMicrophoneClick} src={MicrophoneNormal} alt="microphone_icon" className="absolute cursor-pointer w-[13vh] h-[13vh]" />
      )}
    </div>
  );
}
