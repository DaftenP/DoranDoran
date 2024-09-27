'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import BankEmployee from '@/public/job/bank-employee.webp'
import Doctor from '@/public/job/doctor.webp'
import Friend from '@/public/job/friend.webp'
import HotelStaff from '@/public/job/hotel-staff.webp'
import Interviewer from '@/public/job/interviewer.webp'
import RestaurantServer from '@/public/job/restaurant-server.webp'
import ShopAssistant from '@/public/job/shop-assistant.webp'
import TaxiDriver from '@/public/job/taxi-driver.webp'
import TourGuide from '@/public/job/tour-guide.webp'

export default function PeopleList () {
  const [messages, setMessages] = useState(null);
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
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedPeopleList />
    </NextIntlClientProvider>
  );
}

function TranslatedPeopleList() {
  const t = useTranslations('index');
  const peopleArray = [
    {
      'rule': '1',
      'name': t('friend'),
      'image': Friend
    },
    {
      'rule': '2',
      'name': t('restaurant-server'),
      'image': RestaurantServer
    },
    {
      'rule': '3',
      'name': t('tour-guide'),
      'image': TourGuide
    },
    {
      'rule': '4',
      'name': t('taxi-driver'),
      'image': TaxiDriver
    },
    {
      'rule': '5',
      'name': t('hotel-staff'),
      'image': HotelStaff
    },
    {
      'rule': '6',
      'name': t('doctor'),
      'image': Doctor
    },
    {
      'rule': '7',
      'name': t('bank-employee'),
      'image': BankEmployee
    },
    {
      'rule': '8',
      'name': t('shop-assistant'),
      'image': ShopAssistant
    },
    {
      'rule': '9',
      'name': t('interviewer'),
      'image': Interviewer
    },
  ]

  const [selectedIndex, setSelectedIndex] = useState(null)
  const handlePeopleClick = ((index) => {
    setSelectedIndex(index)
  })

  return (
    <div>
      {peopleArray.map((item, index) => (
        <div key={index}>
          <div onClick={() => handlePeopleClick(index)} className={`relative rounded-3xl w-[80vw] h-[10vh] ${selectedIndex === index ? 'bg-[#1F7EFA]/40 border border-[#1F7EFA]' : 'bg-white/70 border border-[#ACACAC]'} mb-[1vh] flex items-center text-xxl md:text-4xl lg:text-6xl`}>
            <Image src={item.image} alt={item.name} className='w-auto h-3/4 pl-[5vw] pr-[5vw]'/>
            {item.name}
            {selectedIndex === index && (
              <Link href={`ai-tutor/${index}`}>
                <button className="absolute right-5 top-1/2 -translate-y-1/2 text-white bg-[#1F7EFA] rounded-3xl text-xxl md:text-4xl lg:text-6xl pr-5 pl-5 pt-1 pb-1 cursor-pointer">
                  {t('next')}
                </button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
