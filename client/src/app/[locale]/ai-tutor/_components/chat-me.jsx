'use client';

import { useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import Credit from '@/public/icon/credit.webp'
import Exp from '@/public/icon/exp.webp'
import MicrophoneNormal from '@/public/icon/microphone-normal.webp'
import MicrophoneActive from '@/public/icon/microphone-active.webp'
import Microphone from '@/app/[locale]/ai-tutor/_components/microphone';

export default function ChatMe ({ message }) {
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
      <TranslatedChatMe message={message}/>
    </NextIntlClientProvider>
  );
}

function TranslatedChatMe({ message }) {
  const t = useTranslations('index');

  return (
    <div className='flex justify-end items-center m-[2vh]'>
      <div className='rounded-[3vh] min-w-[40vw] max-w-[70vw] bg-[#DFF8E1]/90 border border-[#A8D5B6]/90 text-md md:text-2xl lg:text-5xl p-[2vh]'>
      <Microphone />
        {message}
        <div className='border-b border-[#ACACAC] w-auto h-1 mt-[2vh] mb-[2vh]'></div>
        <div className='flex justify-around'>
          <div className='flex items-center'>
            <Image src={Credit} alt="credit_icon" className="cursor-pointer w-7 h-7 md:w-10 md:h-10 lg:w-16 lg:h-16 mr-1" />
            +400
          </div>
          <div className='flex'>
            <Image src={Exp} alt="exp_icon" className="cursor-pointer w-7 h-7 md:w-10 md:h-10 lg:w-16 lg:h-16 mr-1" />
            +400
          </div>
        </div>
      </div>
      <div className='rounded-full w-11 h-11 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-black ml-1'></div>
    </div>
  );
}
