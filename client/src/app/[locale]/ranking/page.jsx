'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import RankGroup from './_components/rankgroup';
import RankAll from './_components/rankall';
import { fetchMyLeague, fetchRankList } from '@/store/ranking'


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
      <Ranklist />
    </NextIntlClientProvider>
  );
}


function Ranklist() {
  const t = useTranslations('index');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyLeague());
    dispatch(fetchRankList());
  }, [dispatch]);

  const locale = useLocale();
  

  const myLeague = useSelector((state) => state.rankList.myLeague.data);
  const rankList = useSelector((state) => state.rankList.rankList.data);

  const [selectedTab, setSelectedTab] = useState('all'); // 기본은 'all'
  // console.log(selectedTab);

  return (
    <div className="w-[100vw] h-[100vh] relative">
      <section className="z-20">
        <div className="w-[40%] h-[5%] left-[30%] top-[10%] absolute flex items-center bg-[#dddddd] rounded-[20px] border border-[#bdbdbd]">
          <div
            onClick={() => setSelectedTab('group')}
            className={`z-30 w-[50%] h-[100%] absolute flex justify-center items-center 
            ${selectedTab === 'group' ? 'bg-[#f1f3c2] border-[#d2c100]' : 'bg-[#dddddd]'} border rounded-[20px] cursor-pointer`}
          >
            <span className={`text-[15px] font-normal ${
              selectedTab === 'group' ? 'text-black' : 'text-[#ababab]'
            }`}>
              {t('group')}
            </span>
          </div>
          <div
            className={`z-30 w-[50%] h-[100%] left-[50%] absolute flex justify-center items-center 
            ${selectedTab === 'all' ? 'bg-[#f1f3c2] border-[#d2c100]' : 'bg-[#dddddd]'} border rounded-[20px] cursor-pointer`}
            onClick={() => setSelectedTab('all')}
          >
            <span className={`text-[15px] font-normal ${
              selectedTab === 'all' ? 'text-black' : 'text-[#ababab]'
            }`}>
              {t('all')}
            </span>
          </div>
        </div>
      </section>

      {selectedTab === "group" ? (
        <RankGroup myLeague={myLeague} />
      ) : (
        <RankAll rankList={rankList} />
      )}
    </div>
  );
}