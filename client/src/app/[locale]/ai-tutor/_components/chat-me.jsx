'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { expGemUpdate } from '@/store/user'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import Credit from '@/public/icon/credit.webp'
import Exp from '@/public/icon/exp.webp'
import Microphone from '@/app/[locale]/ai-tutor/_components/microphone';
import { toggleScorePlus } from '@/store/ai-tutor'

export default function ChatMe ({ message, params, index }) {
  const [messages, setMessages] = useState(null);
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
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedChatMe message={message} params={params} index={index} />
    </NextIntlClientProvider>
  );
}

function TranslatedChatMe({ message, params, index }) {
  const [isRecordingComplete, setIsRecordingComplete] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const t = useTranslations('index');
  const chatMessages = useSelector((state) => {state.chatMessages})
  const dispatch = useDispatch()

  const handleRecordingComplete = (() => {
    setIsRecordingComplete(true)
  })

  useEffect(() => {
    if (message.content) {
      setIsRecordingComplete(true)
    }
  }, [])

  useEffect(() => {
    if (message.content && !message.scorePlus) {
      if (message.score) {
        const gem = Math.floor(message.score)
        const xp = Math.floor(message.score)
        dispatch(expGemUpdate({ gem, xp }))
        dispatch(toggleScorePlus(index))
      }
    }
  }, [message])

  const handleListening = (() => {
    setIsListening(!isListening)
  })

  return (
    <div className='flex justify-end items-center mr-[2vh] ml-[2vh] mt-[4vh] mb-[4vh]'>
      <div className={`rounded-[3vh] min-w-[40vw] max-w-[70vw] ${isListening ? 'bg-[#DFF8E1]/90' : 'bg-[#DFF8E1]/90'} border border-[#A8D5B6]/90 text-md md:text-2xl lg:text-4xl p-[2vh] transition-colors duration-500`}>
        {!isRecordingComplete ? (
          <Microphone handleListening={handleListening} onRecordingComplete={handleRecordingComplete} params={params} />
        ) : (
          <>
            {!message.content ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div>
                {message.content}
                <div className='border-b border-[#ACACAC] w-auto h-1 mt-[2vh] mb-[2vh]'></div>
                <div className='flex justify-around'>
                  <div className='flex items-center'>
                    <Image src={Credit} alt="credit_icon" className="cursor-pointer w-7 h-7 md:w-10 md:h-10 lg:w-16 lg:h-16 mr-1" />
                    + {Math.floor(message.score)}
                  </div>
                  <div className='flex items-center'>
                    <Image src={Exp} alt="exp_icon" className="cursor-pointer w-7 h-7 md:w-10 md:h-10 lg:w-16 lg:h-16 mr-1" />
                    + {Math.floor(message.score)}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
