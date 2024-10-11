'use client';

import Link from 'next/link';
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function TopicList ({ params }) {
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
      <TranslatedTopicList params={params}/>
    </NextIntlClientProvider>
  );
}

function TranslatedTopicList({ params }) {
  const t = useTranslations('index');
  const router = useRouter()
  const people = params.people
  const effectVolume = useSelector((state) => state.sound.effectVolume)

  const topicArray = {
    '0': [
      t('talk-about-what-you-did-over-the-weekend'),
      t('discuss-a-recent-movie-or-tv-show-you-watched'),
      t('talk-about-your-favorite-food-and-give-a-recommendation'),
      t("share-about-a-new-hobby-you've-started"),
      t('plan-a-vacation-or-holiday-together')
    ],
    '1': [
      t('ask-for-recommendations-on-popular-dishes-from-the-menu'),
      t('ask-if-a-specific-dish-is-available-and-place-an-order'),
      t('request-the-food-to-be-made-less-spicy'),
      t('ask-for-a-refill-of-water-or-a-drink'),
      t('ask-about-payment-methods-when-settling-the-bill')
    ],
    '2': [
      t('get-an-introduction-to-the-most-popular-spots-at-a-tourist-destination'),
      t('listen-to-a-brief-explanation-of-the-history-or-traditions'),
      t('ask-for-recommendations-for-nearby-restaurants-or-cafes'),
      t('get-directions-for-the-next-destination'),
      t('ask-for-help-if-you-get-lost-while-traveling')
    ],
    '3': [
      t('tell-the-driver-your-destination-and-ask-for-the-quickest-route'),
      t('ask-for-an-estimated-taxi-fare'),
      t('make-small-talk-about-the-weather'),
      t('ask-about-popular-tourist-attractions-in-seoul'),
      t("ask-if-you're-getting-close-to-your-destination")
    ],
    '4': [
      t('receive-a-brief-explanation-about-your-room-during-check-in'),
      t('ask-about-the-breakfast-time-and-location'),
      t('request-a-room-cleaning-service'),
      t('ask-for-the-location-of-the-nearest-convenience-store'),
      t('ask-about-the-checkout-time')
    ],
    '5': [
      t('briefly-explain-your-cold-symptoms-and-ask-for-a-prescription'),
      t('ask-if-you-can-get-vaccinated'),
      t('get-simple-advice-on-maintaining-good-health'),
      t('consult-about-mild-headaches-or-indigestion'),
      t('schedule-your-next-medical-appointment')
    ],
    '6': [
      t('ask-what-documents-are-needed-to-open-a-bank-account'),
      t('check-your-account-balance-and-request-a-withdrawal'),
      t('get-an-explanation-on-how-to-set-up-automatic-transfers'),
      t('briefly-inquire-about-the-conditions-for-issuing-a-credit-card'),
      t('ask-for-instructions-on-how-to-use-the-atm')
    ],
    '7': [
      t('ask-where-a-specific-product-is-located'),
      t('ask-if-there-are-any-discount-items-available'),
      t('check-if-the-size-of-the-clothes-fits-and-ask-about-the-exchange-policy'),
      t('ask-about-payment-methods-and-confirm-if-card-payment-is-accepted'),
      t('inquire-about-the-refund-procedure-if-a-purchased-product-has-issues')
    ],
    '8': [
      t('ask-which-job-role-the-applicant-is-interested-in'),
      t('briefly-explain-tasks-performed-at-a-previous-job'),
      t('ask-about-the-most-enjoyable-moment-while-working'),
      t('discuss-what-is-important-to-the-applicant-when-working'),
      t('talk-about-the-strengths-and-weaknesses-of-their-personality')
    ]
  };

  const [selectedIndex, setSelectedIndex] = useState(null)
  const handleTopicClick = ((index) => {
    setSelectedIndex(index)
  })

  const handleGoTalking = (people, index) => {
    const audio = new Audio('/bgm/pencil_check_mark.mp3')
    audio.volume = effectVolume
    audio.play();
    router.push(`${people}/${index}`)
  }
  
  return (
    <div>
      {topicArray[String(people)].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -20 }} // 위에서 아래로 나타나도록 설정
          animate={{ opacity: 1, y: 0 }}   // 나타날 때의 상태
          exit={{ opacity: 0, y: -20 }}     // 사라질 때의 상태
          transition={{ duration: 0.3, delay: index * 0.1 }} // 각 항목에 딜레이를 줘서 순차적으로 나타남
        >
          <div
            onClick={() => handleTopicClick(index)}
            className={`relative rounded-3xl w-[80vw] min-h-[10vh] ${
              selectedIndex === index
                ? 'bg-[#1F7EFA]/40 border border-[#1F7EFA]'
                : 'bg-white/70 border border-[#ACACAC]'
            } mb-[1vh] flex items-center text-xxl md:text-4xl lg:text-6xl p-[3vh]`}
          >
            {item}
            <AnimatePresence>
              {selectedIndex === index && (
                <motion.div
                  key="next-button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-5 -translate-y-1/2"
                >
                  <div onClick={() => handleGoTalking(people, index)}>
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
