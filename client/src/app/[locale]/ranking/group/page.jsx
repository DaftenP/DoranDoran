'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import RankListGroup from '../_components/ranklist-group';
import Bronze from "@/public/rank/bronze.png";
import Silver from "@/public/rank/silver.png";
import Gold from "@/public/rank/gold.png";
import Platinum from "@/public/rank/platinum.png";
import Diamond from "@/public/rank/diamond.png";


export default function Rank() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();
  // 현재 로케일에 맞는 메시지 파일을 동적으로 로드

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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Ranklist />
    </NextIntlClientProvider>
  );
}

function Ranklist() {
  const t = useTranslations('index');
  const router = useRouter();
  const locale = useLocale();

  const handleAllClick = () => {
    router.push(`/${locale}/ranking/all`);  // All 클릭 시 /ranking/all으로 이동
  };

  return (
    <div className="w-[100vw] h-[100vh] relative">
      <section>
        <div className="w-[40%] h-[5%] left-[30%] top-[10%] absolute flex items-center bg-[#dddddd] rounded-[20px] border border-[#bdbdbd]">
          <div
            className="w-[50%] h-[100%] absolute flex justify-center items-center bg-[#f1f3c2] border border-[#d2c100] rounded-[20px]"
          >
            <span className="text-[15px] font-normal font-['Itim'] text-black">Group</span>
          </div>
          <div
            onClick={handleAllClick}
            className="w-[50%] h-[100%] left-[50%] absolute flex justify-center items-center bg-[#dddddd] rounded-[20px]"
          >
            <span className="text-[15px] font-normal font-['Itim'] text-[#ababab]">All</span>
          </div>
        </div>
      </section>

      <section className="w-[90%] h-[70%] left-[5%] top-[22%] py-[2%] absolute bg-[#E6F3F2] bg-opacity-60 rounded-[30px]" >
        <article className="h-[14%] relative flex flex-row justify-center items-end">
          <Image
            src={Gold}
            alt="tier"
            className="w-auto h-[100%]"
          />
          <div className="flex flex-col items-center font-['Itim'] font-semibold text-[3vh]" >
            <span>Group</span>
            <span>17</span>
          </div>
        </article>

        <article className='w-[90%] left-[5%] top-[15%] absolute'>
          <RankListGroup userRank={1} userId="Звезда" userXP={8921} />
          <RankListGroup userRank={2} userId="Stargazer" userXP={8685} />
          <RankListGroup userRank={3} userId="ひかり" userXP={7516} />
          <RankListGroup userRank={4} userId="skyWalker" userXP={7012} />
          <RankListGroup userRank={5} userId="Emma" userXP={6401} />
          <RankListGroup userRank={6} userId="さくら" userXP={5665} />
        </article>

        <div className="w-[90%] h-[6%] bottom-[16vh] fixed">
          <RankListGroup userRank={20} userId="Metallica" userXP={2354} borderColor={"#1cbfff"} />
        </div>
      </section>
    </div>
  );
}