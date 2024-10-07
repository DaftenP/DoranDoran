'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef } from 'react';
import RankListAll from '../_components/ranklist-all';
import { fetchRankList, setRankList } from '@/store/ranking'

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
  const [selectedWeek, setSelectedWeek] = useState("this week");

  const rankList = useSelector((state) => state.rankList.rankList);
  const thisweekRankList = rankList.thisWeek.thisWeekLeaderBoard;
  const lastweekRankList = rankList.lastWeek.lastWeekLeaderBoard;
  const thisweekMyRank = rankList.thisWeek.myLeaderBoard;
  const lastweekMyRank = rankList.lastWeek.myLeaderBoard;

  const myRankRef = useRef([]);
  const scrollToMyRank = () => {
    const myRank = selectedWeek === "this week" ? thisweekMyRank.userRank : lastweekMyRank.userRank;
    const ref = myRankRef.current[myRank - 1]; // 배열 인덱스는 0부터 시작하므로 -1
    if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await dispatch(fetchRankList()); // API 호출
  //   };

  //   fetchData();
  // }, [dispatch]);

  const handleGroupClick = () => {
    router.push(`/${locale}/ranking/group`); 
  };

  return (
    <div className="w-[100vw] h-[100vh] relative">
      <section>
        <div className="w-[40%] h-[5%] left-[30%] top-[10%] absolute flex items-center bg-[#dddddd] rounded-[20px] border border-[#bdbdbd]">
          <div
            onClick={handleGroupClick}
            className="w-[50%] h-[100%] absolute flex justify-center items-center bg-[#dddddd] rounded-[20px]"
          >
            <span className="text-[15px] font-normal text-[#ababab]">{t('group')}</span>
          </div>
          <div
            className="w-[50%] h-[100%] left-[50%] absolute flex justify-center items-center bg-[#f1f3c2] border border-[#d2c100] rounded-[20px]"
          >
            <span className="text-[15px] font-normal text-black">{t('all')}</span>
          </div>
        </div>
        
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
              src={"https://ssafy-tailored.b-cdn.net/shop/bird/2.webp"}
              alt="bird2"
              width={200}
              height={100}
              className="w-[auto] h-[30%] bottom-[85%] absolute"
            />
            <div>
              {selectedWeek === "this week" ? thisweekRankList[1].userNickname : lastweekRankList[1].userNickname}
            </div>
            <div>
              {selectedWeek === "this week" ? thisweekRankList[1].gainXp : lastweekRankList[1].gainXp}
            </div>
            <div className="text-[20px] font-bold">2</div>
          </div>
          <div className="w-[25%] h-[100%] grid place-items-center text-center bg-[#f8d87b] rounded-tl-[10px] rounded-tr-[10px] mx-[2%]">
            <Image
              src={"https://ssafy-tailored.b-cdn.net/shop/bird/2.webp"}
              alt="bird2"
              width={200}
              height={100}
              className="w-[auto] h-[30%] bottom-[100%] absolute"
            />
            <div>
              {selectedWeek === "this week" ? thisweekRankList[0].userNickname : lastweekRankList[0].userNickname}
            </div>
            <div>
              {selectedWeek === "this week" ? thisweekRankList[0].gainXp : lastweekRankList[0].gainXp}
            </div>
            <div className="text-[30px] font-bold">1</div>
          </div>
          <div className="w-[25%] h-[70%] grid place-items-center text-center bg-[#e8a57e] rounded-tl-[10px] rounded-tr-[10px]">
            <Image
              src={"https://ssafy-tailored.b-cdn.net/shop/bird/2.webp"}
              alt="bird2"
              width={200}
              height={100}
              className="w-[auto] h-[30%] bottom-[70%] absolute"
            />
            <div>
              {selectedWeek === "this week" ? thisweekRankList[2].userNickname : lastweekRankList[2].userNickname}
            </div>
            <div>
              {selectedWeek === "this week" ? thisweekRankList[2].gainXp : lastweekRankList[2].gainXp}
            </div>
            <div className="text-[20px] font-bold">3</div>
          </div>
        </article>

        <div className="w-[90%] h-[4%] left-[5%] absolute bg-[#9EEDE4] rounded-[5px]" />

        <article className='w-[90%] left-[5%] top-[33%] absolute h-[50%] overflow-auto'>
        {(selectedWeek === "this week" ? thisweekRankList : lastweekRankList).slice(3).map((item, index) => (
            <RankListAll
              key={item.userId}
              userRank={item.userRank}
              userName={item.userNickname}
              userXP={item.gainXp}
              borderColor={
                (selectedWeek === "this week" && item.userRank === thisweekMyRank.userRank) ||
                (selectedWeek === "last week" && item.userRank === lastweekMyRank.userRank)
                  ? "#1cbfff"
                  : "#bbbbbb"
              }
              ref={(el) => myRankRef.current[item.userRank - 1] = el}
            />
          ))}
        </article>

        <div className="w-[90%] h-[6%] bottom-[13vh] fixed" onClick={scrollToMyRank}>
          <RankListAll 
            userRank={selectedWeek === "this week" ? thisweekMyRank.userRank : lastweekMyRank.userRank} 
            userName={selectedWeek === "this week" ? thisweekMyRank.userNickname : lastweekMyRank.userNickname} 
            userXP={selectedWeek === "this week" ? thisweekMyRank.gainXp : lastweekMyRank.gainXp} 
            borderColor={"#1cbfff"} />
        </div>
      </section>
    </div>
    
  );
}