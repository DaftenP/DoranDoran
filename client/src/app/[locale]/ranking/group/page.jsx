'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef } from 'react';
import RankListGroup from '../_components/ranklist-group';
import Bronze from "@/public/rank/bronze.webp";
import Silver from "@/public/rank/silver.webp";
import Gold from "@/public/rank/gold.webp";
import Platinum from "@/public/rank/platinum.webp";
import Diamond from "@/public/rank/diamond.webp";


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

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Ranklist />
    </NextIntlClientProvider>
  );
}

function Ranklist() {
  const t = useTranslations('index');
  const dispatch = useDispatch();

  const router = useRouter();
  const locale = useLocale();

  const myGroup = useSelector((state) => state.rankList.myGroup);
  const myGroupList = myGroup.leagueMembers;
  const myGroupNum = myGroup.leagueNum;
  const myRank = myGroup.myRank;

  const myRankRef = useRef([]);
  const scrollToMyRank = () => {
    const ref = myRankRef.current[myRank.userRank - 1]; // 배열 인덱스는 0부터 시작하므로 -1
    if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };  

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
            <span className="text-[15px] font-normal text-black">{t('group')}</span>
          </div>
          <div
            onClick={handleAllClick}
            className="w-[50%] h-[100%] left-[50%] absolute flex justify-center items-center bg-[#dddddd] rounded-[20px]"
          >
            <span className="text-[15px] font-normal text-[#ababab]">{t('all')}</span>
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
          <div className="flex flex-col items-center font-semibold text-[3vh]" >
            <span>{t('group')}</span>
            <span>{myGroupNum}</span>
          </div>
        </article>

        <article className='w-[90%] left-[5%] top-[15%] absolute h-[65%] overflow-auto'>
        {myGroupList.map((item, index) => (
          <RankListGroup 
            key={item.userId} 
            userRank={item.userRank} 
            userName={item.userName} 
            userXP={item.userXP}
            myRank={myRank.userRank}
            ref={(el) => myRankRef.current[item.userRank - 1] = el} 
            borderColor={ item.userRank === myRank.userRank ?  "#1cbfff" : "#bbbbbb"}
          />
        ))}
        </article>

        <div className="w-[90%] h-[6%] bottom-[16vh] fixed" onClick={scrollToMyRank}>
          <RankListGroup userRank={myRank.userRank} userName={myRank.userName} userXP={myRank.userXP} myRank={myRank.userRank} borderColor={"#1cbfff"} />
        </div>
      </section>
    </div>
  );
}