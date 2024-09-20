'use client';

import { useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import BankEmployee from '@/public/job/bank-employee.png'
import Doctor from '@/public/job/doctor.png'
import Friend from '@/public/job/friend.png'
import HotelStaff from '@/public/job/hotel-staff.png'
import Interviewer from '@/public/job/interviewer.png'
import RestaurantServer from '@/public/job/restaurant-server.png'
import ShopAssistant from '@/public/job/shop-assistant.png'
import TaxiDriver from '@/public/job/taxi-driver.png'
import TourGuide from '@/public/job/tour-guide.png'

export default function PeopleList () {
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

  return (
    <div>
      {peopleArray.map((item, index) => (
        <Link href={`ai-tutor/${index}`} key={index}>
          <div className='rounded-3xl w-[80vw] h-[10vh] bg-white/70 border border-[#ACACAC] mb-[1vh] flex items-center text-xxl md:text-4xl lg:text-6xl'>
            <Image src={item.image} alt={item.name} className='w-auto h-3/4 pl-[5vw] pr-[5vw]'/>
            {item.name}
          </div>
        </Link>
      ))}
    </div>
  );
}
