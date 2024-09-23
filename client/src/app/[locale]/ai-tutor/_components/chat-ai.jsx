'use client';

import { useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import Play1 from '@/public/icon/play1.png'
import Play2 from '@/public/icon/play2.png'
import Translation from '@/public/icon/translation.png'
import Hint from '@/public/icon/hint.png'
import Bird1 from '@/public/shop-bird/bird (6).png'

export default function ChatAi ({ message }) {
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
      <TranslatedChatAi message={message}/>
    </NextIntlClientProvider>
  );
}

function TranslatedChatAi({ message }) {
  const t = useTranslations('index');
  const [isPlay, setIsPlay] = useState(false)

  return (
    <div className='flex items-center m-[2vh]'>
      <Image src={Bird1} alt="bird_icon" className="w-11 h-11 md:w-16 md:h-16 lg:w-20 lg:h-20 mr-1" />
      <div className='rounded-[3vh] min-w-[40vw] max-w-[70vw] bg-[#FED9D0]/90 border border-[#FFC0B1]/90 text-md md:text-2xl lg:text-5xl p-[2vh]'>
        {message}
        <div className='border-b border-[#ACACAC] w-auto h-1 mt-[2vh] mb-[2vh]'></div>
        <div className='flex justify-around'>
          <Image src={Play1} alt="play_button" className="cursor-pointer w-3 h-4 md:w-7 md:h-8 lg:w-11 lg:h-12" />
          <Image src={Translation} alt="translation_button" className="cursor-pointer w-4 h-4 md:w-8 md:h-8 lg:w-12 lg:h-12" />
          <Image src={Hint} alt="hint-button" className="cursor-pointer w-4 h-4 md:w-8 md:h-8 lg:w-12 lg:h-12" />
        </div>
      </div>
    </div>
  );
}
