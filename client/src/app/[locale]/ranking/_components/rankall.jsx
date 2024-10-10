'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef } from 'react';
import RankListAll from './ranklist-all';
import Bird5 from "@/public/shop-bird/bird (5).webp";
import Bird6 from "@/public/shop-bird/bird (6).webp";
import Bird7 from "@/public/shop-bird/bird (7).webp";


export default function RankAll({ rankList }) {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();
  // 현재 로케일에 맞는 메시지 파일을 동적으로 로드

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
      <RanklistAll rankList = {rankList}/>
    </NextIntlClientProvider>
  );
}

function RanklistAll({ rankList }) {
  const t = useTranslations('index');

  const locale = useLocale();
  const [selectedWeek, setSelectedWeek] = useState("this week");

  const thisWeekRankList = rankList?.thisWeek?.thisWeekLeaderBoard;
  const lastWeekRankList = rankList?.lastWeek?.lastWeekLeaderBoard;
  const thisWeekMyRank = rankList?.thisWeek?.myLeaderBoard;
  const lastWeekMyRank = rankList?.lastWeek?.myLeaderBoard;

  const myRankRef = useRef([]);
  const scrollToMyRank = () => {
    const myRank = selectedWeek === "this week" ? thisWeekMyRank?.order : lastWeekMyRank?.order;
    const ref = myRankRef.current[myRank - 1]; // 배열 인덱스는 0부터 시작하므로 -1
    if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };  

  return (
    <div className="w-[100vw] h-[100vh] relative">
      <section>
        
        <div className="w-[34%] h-[3%] left-[33%] top-[16%] absolute flex items-center bg-[#dddddd] rounded-[20px] border border-[#bdbdbd]">
          <div
            onClick={() => setSelectedWeek("last week")}
            className={`w-[50%] h-[100%] absolute flex justify-center items-center ${
              selectedWeek === "last week" ? "bg-[#00c3ff] border border-[#0077cc]" : "bg-[#dddddd]"
            } rounded-[20px]`}
          >
            <span className={`text-[11px] font-normal ${
              selectedWeek === "last week" ? "text-white" : "text-[#ababab]"
            }`}>
              {t('last-week')}
            </span>
          </div>
          <div
            onClick={() => setSelectedWeek("this week")}
            className={`w-[50%] h-[100%] left-[50%] absolute flex justify-center items-center ${
              selectedWeek === "this week" ? "bg-[#00c3ff] border border-[#0077cc]" : "bg-[#dddddd]"
            } rounded-[20px]`}
          >
            <span className={`text-[11px] font-normal ${
              selectedWeek === "this week" ? "text-white" : "text-[#ababab]"
            }`}>
              {t('this-week')}
            </span>
          </div>
        </div>
      </section>

      <section className="w-[90%] h-[70%] left-[5%] top-[22%] py-[10%] absolute bg-[#E6F3F2] bg-opacity-60 rounded-[30px]" >
        <article className="h-[25%] relative flex justify-center items-end">
          <div className="w-[25%] h-[85%] grid place-items-center bg-[#d9d9d9] rounded-tl-[10px] rounded-tr-[10px]">
            <Image
              src={Bird5}
              alt="bird2"
              width={200}
              height={100}
              className="w-[auto] h-[30%] bottom-[85%] absolute"
            />
            <div className="text-xs">
              {selectedWeek === "this week" ? thisWeekRankList[1]?.userNickname : lastWeekRankList[1]?.userNickname}
            </div>
            <div>
              {selectedWeek === "this week" ? thisWeekRankList[1]?.gainXp : lastWeekRankList[1]?.gainXp}
            </div>
            <div className="text-[20px] font-bold">2</div>
          </div>
          <div className="w-[25%] h-[100%] grid place-items-center text-center bg-[#f8d87b] rounded-tl-[10px] rounded-tr-[10px] mx-[2%]">
            <Image
              src={Bird6}
              alt="bird2"
              width={200}
              height={100}
              className="w-[auto] h-[30%] bottom-[100%] absolute"
            />
            <div className="text-xs">
              {selectedWeek === "this week" ? thisWeekRankList[0]?.userNickname : lastWeekRankList[0]?.userNickname}
            </div>
            <div>
              {selectedWeek === "this week" ? thisWeekRankList[0]?.gainXp : lastWeekRankList[0]?.gainXp}
            </div>
            <div className="text-[30px] font-bold">1</div>
          </div>
          <div className="w-[25%] h-[70%] grid place-items-center text-center bg-[#e8a57e] rounded-tl-[10px] rounded-tr-[10px]">
            <Image
              src={Bird7}
              alt="bird2"
              width={200}
              height={100}
              className="w-[auto] h-[30%] bottom-[70%] absolute"
            />
            <div className="text-xs">
              {selectedWeek === "this week" ? thisWeekRankList[2]?.userNickname : lastWeekRankList[2]?.userNickname}
            </div>
            <div>
              {selectedWeek === "this week" ? thisWeekRankList[2]?.gainXp : lastWeekRankList[2]?.gainXp}
            </div>
            <div className="text-[20px] font-bold">3</div>
          </div>
        </article>

        <div className="w-[90%] h-[4%] left-[5%] absolute bg-[#9EEDE4] rounded-[5px]" />

        <article className='w-[90%] left-[5%] top-[33%] absolute h-[50%] overflow-auto overflow-y-scroll hide-scrollbar'>
        {(selectedWeek === "this week" ? thisWeekRankList : lastWeekRankList).slice(3).map((item, index) => (
            <RankListAll
              key={item.userId}
              userChar={index}
              userorder={item.order}
              userName={item.userNickname}
              userTier={item.userRank}
              userXP={item.gainXp}
              borderColor={
                (selectedWeek === "this week" && item?.order === thisWeekMyRank?.order) ||
                (selectedWeek === "last week" && item?.order === lastWeekMyRank?.order)
                  ? "#1cbfff"
                  : "#bbbbbb"
              }
              ref={(el) => myRankRef.current[item.order - 1] = el}
            />
          ))}
        </article>

        <div className="w-[90%] h-[6%] bottom-[13vh] fixed" onClick={scrollToMyRank}>
          <RankListAll 
            userorder={selectedWeek === "this week" ? thisWeekMyRank?.order : lastWeekMyRank?.order} 
            userChar={1}
            userName={selectedWeek === "this week" ? thisWeekMyRank?.userNickname : lastWeekMyRank?.userNickname} 
            userTier={selectedWeek === "this week" ? thisWeekMyRank?.userRank : lastWeekMyRank?.userRank} 
            userXP={selectedWeek === "this week" ? thisWeekMyRank?.gainXp : lastWeekMyRank?.gainXp} 
            borderColor={"#1cbfff"} />
        </div>
      </section>
    </div>
    
  );
}