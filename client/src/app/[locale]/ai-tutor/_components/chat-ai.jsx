'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPlayState, toggleHint, toggleResponsePlay, toggleTyping } from '@/store/ai-tutor';
import Link from 'next/link';
import Image from 'next/image'
import Play1 from '@/public/icon/play1.webp'
import Play2 from '@/public/icon/play2.webp'
import Translation from '@/public/icon/translation.webp'
import Hint from '@/public/icon/hint.webp'
import Bird1 from '@/public/shop-bird/bird (6).webp'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatAi ({ index, message }) {
  const [messages, setMessages] = useState(null);
  const dispatch = useDispatch()
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
      <TranslatedChatAi index={index} message={message} />
    </NextIntlClientProvider>
  );
}

let currentUtterance = null

function TranslatedChatAi({ index, message }) {
  const t = useTranslations('index');
  const dispatch = useDispatch()
  const chatMessages = useSelector((state) => state.aiTutor.chatMessages)
  const [isTranslate, setIsTranslate] = useState(false)

  const handlePlay = (index) => {
    speechSynthesis.cancel()
    if (message.isResponsePlay) {
      dispatch(toggleResponsePlay(index))
    } else {
      if (currentUtterance) {
        speechSynthesis.cancel()
      }
      const utterance = new SpeechSynthesisUtterance(message.tutorResponse)
      utterance.lang = 'ko-KR'

      utterance.onend = () => {
        dispatch(toggleResponsePlay(index))
      }

      speechSynthesis.speak(utterance)
      dispatch(toggleResponsePlay(index))
      currentUtterance = utterance
    }
  }
  
  const handleTranslate = () => {
    setIsTranslate(!isTranslate)
  }

  const handleHint = (index) => {
    dispatch(toggleHint(index))
  }

  useEffect(() => {
    handlePlay(index)
  }, [])

  const TypewriterText = ({ text, index }) => {
    const letters = text.split("");

    const containerVariants = {
      animate: {
        transition: {
          staggerChildren: 0.05, // 글자 간의 애니메이션 간격
        }
      }
    };

    const letterVariants = {
      initial: { opacity: 0 },  // 처음에는 보이지 않음
      animate: { opacity: 1 },  // 차례대로 나타남
    };

    return (
      <motion.div
        className="inline-block"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        onAnimationComplete={() => {
          // 애니메이션이 완료된 후 toggleTyping 실행
          dispatch(toggleTyping(index));
        }}
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={letterVariants}>
            {letter}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className='flex items-center m-[2vh]'>
      <Image src={Bird1} alt="bird_icon" className="w-11 h-11 md:w-16 md:h-16 lg:w-20 lg:h-20 mr-1" />
      <div className='rounded-[3vh] min-w-[40vw] max-w-[70vw] bg-[#FED9D0]/90 border border-[#FFC0B1]/90 text-md md:text-2xl lg:text-5xl p-[2vh]'>
        {isTranslate ? (
            <div>
              {message.translatedResponse}
            </div>
          ) : (
            message.isTyping ? (
              message.tutorResponse
            ) : (
              <div>
                <TypewriterText text={message.tutorResponse} index={index} />
              </div>
            )
          )}
        <div className='border-b border-[#ACACAC] w-auto h-1 mt-[2vh] mb-[2vh]'></div>
        <div className='flex justify-around'>
          <Image onClick={() => handlePlay(index)} src={message.isResponsePlay ? Play2 : Play1} alt="play_button" className='cursor-pointer w-3 h-4 md:w-7 md:h-8 lg:w-11 lg:h-12' />
          <Image onClick={handleTranslate} src={Translation} alt="translation_button" className={`cursor-pointer ${isTranslate ? 'opacity-100 w-5 h-5 md:w-9 md:h-9 lg:w-14 lg:h-14' : 'opacity-60 w-4 h-4 md:w-8 md:h-8 lg:w-12 lg:h-12' }`} />
          <Image onClick={() => handleHint(index)} src={Hint} alt="hint-button" className={`cursor-pointer ${message.isHint ? 'opacity-100 w-5 h-5 md:w-9 md:h-9 lg:w-14 lg:h-14' : 'opacity-60 w-4 h-4 md:w-8 md:h-8 lg:w-12 lg:h-12' }`} />
        </div>
      </div>
    </div>
  );
}