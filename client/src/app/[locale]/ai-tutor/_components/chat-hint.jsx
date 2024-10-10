'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPlayState, toggleHintPlay } from '@/store/ai-tutor';
import Link from 'next/link';
import Image from 'next/image'
import Play1 from '@/public/icon/play1.webp'
import Play2 from '@/public/icon/play2.webp'
import Translation from '@/public/icon/translation.webp'

export default function ChatHint ({ index, message }) {
  const [messages, setMessages] = useState(null);
  const dispatch = useDispatch()
  const locale = useLocale();

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        // console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
    return () => {
      dispatch(resetPlayState())
      speechSynthesis.cancel()
    }
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedChatHint index={index} message={message} />
    </NextIntlClientProvider>
  );
}

let currentUtterance = null

function TranslatedChatHint({ index, message }) {
  const t = useTranslations('index');
  const dispatch = useDispatch()
  const [isTranslate, setIsTranslate] = useState(false)

  const handlePlay = () => {
    speechSynthesis.cancel()
    if (message.isHintPlay) {
      dispatch(toggleHintPlay(index))
    } else {
      if (currentUtterance) {
        speechSynthesis.cancel()
      }
      const utterance = new SpeechSynthesisUtterance(message.hint)
      utterance.lang = 'ko-KR'

      utterance.onend = () => {
        dispatch(toggleHintPlay(index))
      }

      speechSynthesis.speak(utterance)
      dispatch(toggleHintPlay(index))
      currentUtterance = utterance
    }
  }
  
  const handleTranslate = () => {
    setIsTranslate(!isTranslate)
  }

  return (
    <div className='flex items-center m-[2vh]'>
      <Image src={"https://ssafy-tailored.b-cdn.net/shop/bird/7.webp"} alt="bird_icon" width={200} height={100} className="w-11 h-11 md:w-16 md:h-16 lg:w-20 lg:h-20 mr-1" />
      <div className='rounded-[3vh] min-w-[40vw] max-w-[70vw] bg-[#DFF8E1]/90 border border-[#A8D5B6]/90 text-md md:text-2xl lg:text-4xl p-[2vh]'>
        {isTranslate ? (
          <div>
            {message.translatedHint}
          </div>
        ) : (
          <div>
            {message.hint}
          </div>
        )}
        <div className='border-b border-[#ACACAC] w-auto h-1 mt-[2vh] mb-[2vh]'></div>
        <div className='flex justify-around'>
          <Image onClick={() => handlePlay(index)} src={message.isHintPlay ? Play2 : Play1} alt="play_button" className="cursor-pointer w-3 h-4 md:w-7 md:h-8 lg:w-11 lg:h-12" />
          <Image onClick={handleTranslate} src={Translation} alt="translation_button" className={`cursor-pointer ${isTranslate ? 'opacity-100 w-5 h-5 md:w-9 md:h-9 lg:w-14 lg:h-14' : 'opacity-60 w-4 h-4 md:w-8 md:h-8 lg:w-12 lg:h-12' }`} />
        </div>
      </div>
    </div>
  );
}
