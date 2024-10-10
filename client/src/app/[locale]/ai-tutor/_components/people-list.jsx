'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
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
import { motion, AnimatePresence } from 'framer-motion'

export default function PeopleList () {
  const [messages, setMessages] = useState(null);
  const locale = useLocale();

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
      <TranslatedPeopleList />
    </NextIntlClientProvider>
  );
}

function TranslatedPeopleList() {
  const t = useTranslations('index');
  const router = useRouter()
  const effectVolume = useSelector((state) => state.sound.effectVolume)
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

  const handleGoTopic = (index) => {
    const audio = new Audio('/bgm/pencil_check_mark.mp3')
    audio.volume = effectVolume
    audio.play();
    router.push(`ai-tutor/${index}`)
  }
 
  return (
    <div>
      {peopleArray.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -20 }} // 처음에는 위에서 시작 (y: -20)
          animate={{ opacity: 1, y: 0 }}   // 아래로 내려오며 보이기 (y: 0)
          transition={{ duration: 0.3, delay: index * 0.1 }} // 각 항목에 시간차를 두어 순차적으로 나타남
        >
          <div
            onClick={() => handlePeopleClick(index)}
            className={`relative rounded-3xl w-[80vw] h-[10vh] ${
              selectedIndex === index
                ? 'bg-[#1F7EFA]/40 border border-[#1F7EFA]'
                : 'bg-white/70 border border-[#ACACAC]'
            } mb-[1vh] flex items-center text-xxl md:text-4xl lg:text-6xl`}
          >
            <Image src={item.image} alt={item.name} className="w-auto h-3/4 pl-[5vw] pr-[5vw]" />
            {item.name}

            <AnimatePresence>
              {selectedIndex === index && (
                <motion.div
                  key="next-button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-5 -translate-y-1/2"
                >
                  <div onClick={() => handleGoTopic(index)}>
                    <button className="text-white bg-[#1F7EFA] rounded-3xl text-xxl md:text-4xl lg:text-6xl pr-5 pl-5 pt-1 pb-1 cursor-pointer">
                      {t('next')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
