'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetchUserData } from '@/store/user'
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image'
import Bronze from '@/public/rank/bronze.webp'
import Diamond from '@/public/rank/diamond.webp'
import Gold from '@/public/rank/gold.webp'
import Platinum from '@/public/rank/platinum.webp'
import Silver from '@/public/rank/silver.webp'
import Credit from '@/public/icon/credit.webp'
import Megaphone from '@/public/icon/megaphone.webp'

export default function Top() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();
  const dispatch = useDispatch()

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

    dispatch(fetchUserData())

  }, [locale, dispatch]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedTop />
    </NextIntlClientProvider>
  );
}

function TranslatedTop() {
  const user = useSelector((state) => state.user)
  const tutorData = JSON.parse(localStorage.getItem('tutor'))

  const rankImage = {
    0: Bronze,
    1000: Bronze,
    2000: Silver,
    3000: Gold,
    4000: Platinum,
    5000: Diamond,
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-[6vh] flex justify-between pr-[5vw] pl-[5vw] z-10 backdrop-blur-sm"
      style={{ paddingTop: '1vh', marginBottom: '1vh' }}
    >
      <div className="flex items-center">
        <Image src={rankImage[user.status.rank]} alt="gold_rank" className="w-auto h-5/6" />
      </div>
      <div className="flex-col flex justify-center">
        <div className="text-sm overflow-hidden whitespace-nowrap text-ellipsis max-w-[27vw] text-sm md:text-2xl lg:text-3xl">
          Lv. {Math.floor(user.status.xp / 100)} {user.profile.nickname}
        </div>
        <div className="w-[27vw] h-[1vh] rounded-full bg-[#70D7FF]/50">
          <div className="h-full rounded-full bg-[#1CBFFF]" style={{ width: `${(user.status.xp % 100)}%` }} />
        </div>
      </div>
      <div className='flex items-center'>
        <Image src={Credit} alt="credit" className="w-auto h-3/4 z-10" />
        <div
          className="w-[20vw] h-[3vh] rounded-tr-full rounded-br-full bg-[#575757] text-white flex justify-center items-center text-sm md:text-3xl lg:text-4xl"
          style={{ translate: '-1vw 0'}}
        >
          {user.status.gem}
        </div>
      </div>
      <div className='flex items-center'>
        <div className="w-auto h-3/4 z-10 rounded-full bg-[#FFCC77]">
          <Image src={Megaphone} alt="megaphone" className="w-auto h-full p-0.5" />
        </div>
        <div
          className="w-[15vw] h-[3vh] rounded-tr-full rounded-br-full bg-[#575757] text-white flex justify-center items-center text-sm md:text-3xl lg:text-4xl"
          style={{ translate: '-1vw 0'}}
        >
          {tutorData ? `${tutorData.tutorLimit}/10` : 'No data'}
        </div>
      </div>
    </div>
  );
}
