'use client';

import { useTranslations } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image'
import AiTutor from '@/public/bottom-bar/ai-tutor.png'
import Home from '@/public/bottom-bar/home.png'
import Profile1 from '@/public/bottom-bar/profile1.png'
import Profile2 from '@/public/bottom-bar/profile2.png'
import Ranking1 from '@/public/bottom-bar/ranking1.png'
import Ranking2 from '@/public/bottom-bar/ranking2.png'
import Store1 from '@/public/bottom-bar/store1.png'
import Store2 from '@/public/bottom-bar/store2.png'
import Study1 from '@/public/bottom-bar/study1.png'
import Study2 from '@/public/bottom-bar/study2.png'

export default function Bottom() {
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
      <TranslatedBottom />
    </NextIntlClientProvider>
  );
}

function TranslatedBottom() {
  const t = useTranslations('index');
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    const pathArray = pathname.split('/')
    setCurrentPage(pathArray[2]);
  }, [pathname]);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-none flex justify-between">
      <div
        className="relative w-[50vw] rounded-none"
      >
        <div
          className="w-[50vw] h-[10vh] rounded-tr-[10px] bg-[#E4FEFF]"
          style={{
            transform: "skew(30deg) translate(-20px, 0px)",
            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="flex justify-around items-center w-full h-full"
            style={{transform: "skew(-30deg)"}}
          >
            {currentPage === 'store' ? (
              <Image src={Store2} alt="store_link" className="w-auto h-2/5 cursor-pointer ml-6" />
            ) : (
              <Image src={Store1} alt="store_link" className="w-auto h-2/5 cursor-pointer ml-6" />
            )}
            {currentPage === 'study' ? (
              <Image src={Study2} alt="study_link" className="w-auto h-2/5 cursor-pointer mr-9" />
            ) : (
              <Image src={Study1} alt="study_link" className="w-auto h-2/5 cursor-pointer mr-9" />
            )}
          </div>
        </div>
      </div>
      <div
        className="absolute w-[12vh] h-[12vh] bg-[#E4FEFF] rounded-full flex items-center justify-center left-1/2 transform -translate-x-1/2 bottom-0 z-10"
        style={{ boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.25)" }}
      >
        {currentPage === 'main' ? (
          <Image src={AiTutor} alt="ai_tutor_link" className="w-auto h-3/5 cursor-pointer" />
        ) : (
          <Image src={Home} alt="Home_link" className="w-auto h-3/5 cursor-pointer" />
        )}
      </div>
      <div className="w-[50vw] rounded-none">
        <div
          className="w-[50vw] h-[10vh] rounded-tl-[10px] bg-[#E4FEFF]"
          style={{
            transform: "skew(-30deg) translate(20px, 0px)",
            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="flex justify-around items-center w-full h-full"
            style={{transform: "skew(30deg)"}}
          >
            {currentPage === 'ranking' ? (
              <Image src={Ranking2} alt="store_link" className="w-auto h-2/5 cursor-pointer ml-9" />
            ) : (
              <Image src={Ranking1} alt="store_link" className="w-auto h-2/5 cursor-pointer ml-9" />
            )}
            {currentPage === 'profile' ? (
              <Image src={Profile2} alt="study_link" className="w-auto h-2/5 cursor-pointer mr-6" />
            ) : (
              <Image src={Profile1} alt="study_link" className="w-auto h-2/5 cursor-pointer mr-6" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
