'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import RankListAll from '../_components/ranklist-all';
import Bird2 from "@/public/shop-bird/bird (2).png";


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
  const [selectedGroup, setSelectedGroup] = useState("All");  // Group / All 토글 상태
  const [selectedWeek, setSelectedWeek] = useState("this week"); // last week / this week 토글 상태

  return (
    // <div>
    <div className="w-[100vw] h-[100vh] relative">
      <section>
      <div className="w-[40%] h-[5%] left-[30%] top-[10%] absolute flex items-center bg-[#dddddd] rounded-[20px] border border-[#bdbdbd]">
        <div
          onClick={() => setSelectedGroup("Group")}
          className={`w-[50%] h-[100%] absolute flex justify-center items-center ${
            selectedGroup === "Group" ? "bg-[#f1f3c2] border border-[#d2c100]" : "bg-[#dddddd]"
          } rounded-[20px]`}
        >
          <span className={`text-[15px] font-normal font-['Itim'] ${
            selectedGroup === "Group" ? "text-black" : "text-[#ababab]"
          }`}>
            Group
          </span>
        </div>
        <div
          onClick={() => setSelectedGroup("All")}
          className={`w-[50%] h-[100%] left-[50%] absolute flex justify-center items-center ${
            selectedGroup === "All" ? "bg-[#f1f3c2] border border-[#d2c100]" : "bg-[#dddddd]"
          } rounded-[20px]`}
        >
          <span className={`text-[15px] font-normal font-['Itim'] ${
            selectedGroup === "All" ? "text-black" : "text-[#ababab]"
          }`}>
            All
          </span>
        </div>
      </div>
        
      <div className="w-[34%] h-[3%] left-[33%] top-[16%] absolute flex items-center bg-[#dddddd] rounded-[20px] border border-[#bdbdbd]">
        <div
          onClick={() => setSelectedWeek("last week")}
          className={`w-[50%] h-[100%] absolute flex justify-center items-center ${
            selectedWeek === "last week" ? "bg-[#00c3ff] border border-[#0077cc]" : "bg-[#dddddd]"
          } rounded-[20px]`}
        >
          <span className={`text-[11px] font-normal font-['Itim'] ${
            selectedWeek === "last week" ? "text-white" : "text-[#ababab]"
          }`}>
            last week
          </span>
        </div>
        <div
          onClick={() => setSelectedWeek("this week")}
          className={`w-[50%] h-[100%] left-[50%] absolute flex justify-center items-center ${
            selectedWeek === "this week" ? "bg-[#00c3ff] border border-[#0077cc]" : "bg-[#dddddd]"
          } rounded-[20px]`}
        >
          <span className={`text-[11px] font-normal font-['Itim'] ${
            selectedWeek === "this week" ? "text-white" : "text-[#ababab]"
          }`}>
            this week
          </span>
        </div>
      </div>
      </section>

      <section className="w-[90%] h-[70%] left-[5%] top-[22%] py-[10%] absolute bg-[#E6F3F2] bg-opacity-60 rounded-[30px]" >
        <article className="h-[25%] relative flex justify-center items-end">
          <div className="w-[25%] h-[85%] grid place-items-center bg-[#d9d9d9] rounded-tl-[10px] rounded-tr-[10px]">
            <Image
              src={Bird2}
              alt="bird2"
              className="w-[auto] h-[30%] bottom-[85%] absolute"
            />
            <div>Stargazer</div>
            <div>8685</div>
            <div className="text-[20px] font-bold font-['Itim']">2</div>
          </div>
          <div className="w-[25%] h-[100%] grid place-items-center text-center bg-[#f8d87b] rounded-tl-[10px] rounded-tr-[10px] mx-[2%]">
            <Image
              src={Bird2}
              alt="bird2"
              className="w-[auto] h-[30%] bottom-[100%] absolute"
            />
            <div>Звезда</div>
            <div>8921</div>
            <div className="text-[30px] font-bold font-['Itim']">1</div>
          </div>
          <div className="w-[25%] h-[70%] grid place-items-center text-center bg-[#e8a57e] rounded-tl-[10px] rounded-tr-[10px]">
            <Image
              src={Bird2}
              alt="bird2"
              className="w-[auto] h-[30%] bottom-[70%] absolute"
            />
            <div>ひかり</div>
            <div>7516</div>
            <div className="text-[20px] font-bold font-['Itim']">3</div>
          </div>
        </article>

        <div className="w-[90%] h-[4%] left-[5%] absolute bg-[#9EEDE4] rounded-[5px]" />

        <article className='w-[90%] left-[5%] top-[32%] absolute'>
          <RankListAll userRank={4} userId="skyWalker" userXP={7012} borderColor={"#bbbbbb"}/>
          <RankListAll userRank={5} userId="Emma" userXP={6401} borderColor={"#bbbbbb"}/>
          <RankListAll userRank={6} userId="さくら" userXP={5665} borderColor={"#bbbbbb"}/>
          <RankListAll userRank={7} userId="Pierre" userXP={5233} borderColor={"#bbbbbb"}/>
          <RankListAll userRank={8} userId="田中 美咲" userXP={4978} borderColor={"#bbbbbb"}/>
          <RankListAll userRank={9} userId="ほしぞら" userXP={4657} borderColor={"#bbbbbb"}/>
          <RankListAll userRank={10} userId="Jones" userXP={4222} borderColor={"#bbbbbb"}/>
        </article>

        <div className="w-[90%] h-[6%] bottom-[13vh] fixed">
          <RankListAll userRank={53} userId="Metallica" userXP={2354} borderColor={"#1cbfff"} />
        </div>
      </section>
    </div>
    
  );
}