'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DayTask from '@/app/[locale]/main/_components/day-task'
import { motion } from 'framer-motion';

export default function WeekTask() {
  const [messages, setMessages] = useState(null);
  const dispatch = useDispatch()
  const locale = useLocale()

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
      <TranslatedWeekTask />
    </NextIntlClientProvider>
  );
}

function TranslatedWeekTask() {
  const t = useTranslations('index');
  const user = useSelector((state) => state.user)
  
  const dynamicWidth = `${9 * user.mission.dailyStatus}vw`

  return (
    <div className='flex-col flex items-center'>
      <div className="rounded-tl-full rounded-tr-full w-[90vw] h-[3vh] bg-gradient-to-r from-[#CFF6F9] to-[#A2F1FF] flex justify-center items-center text-md md:text-2xl lg:text-4xl">
        {t("week's-task")}
      </div>

      <div className="w-[90vw] h-[0.5vh] bg-gradient-to-r from-[#A2F1FF] to-[#CFF6F9]"></div>

      <div className="w-[90vw] h-[17vw] md:h-[15vw] bg-gradient-to-r from-[#CFF6F9] to-[#A2F1FF] flex justify-center items-center">
        <div className="rounded-2xl w-[84vw] h-[13vw] md:h-[12vw] bg-white/75 overflow-hidden">
          <DayTask />
        </div>
      </div>

      <div className="w-[90vw] h-[0.5vh] bg-gradient-to-r from-[#A2F1FF] to-[#CFF6F9]"></div>

      <div className="relative rounded-bl-full rounded-br-full w-[90vw] h-[3vh] bg-gradient-to-r from-[#CFF6F9] to-[#A2F1FF] overflow-hidden text-center shadow-xl">
        {/* <div style={{ width: dynamicWidth }} className="absolute top-0 left-0 h-[3vh] bg-gradient-to-r from-[#2FB9FE] to-[#007ACC]"></div> */}
        <div
          style={{ width: dynamicWidth }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2FB9FE] to-[#007ACC] rounded-tr-xl"
        ></div>

        {/* 물결 SVG 애니메이션 */}
        <div
          style={{ width: dynamicWidth }}
          className="absolute top-0 left-0 h-full overflow-hidden"
        >
          <svg
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-full"
          >
            <path
              d="M0 30 Q 250 80 500 30 T 1000 30 V 100 H 0 Z"
              fill="#2FB9FE"
            >
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values="
                  M0 30 Q 250 80 500 30 T 1000 30 V 100 H 0 Z;
                  M0 30 Q 250 50 500 70 T 1000 50 V 100 H 0 Z;
                  M0 30 Q 250 80 500 30 T 1000 30 V 100 H 0 Z"
              />
            </path>
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-sm md:text-2xl lg:text-4xl">
          {user.mission.dailyStatus}/10
        </div>
      </div>
    </div>
  );
}
