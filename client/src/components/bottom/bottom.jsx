'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { resetState } from '@/store/ai-tutor';
import { updateTutorLimit } from '@/store/user';
import Modal from '@/components/modal/modal';
import Link from 'next/link';
import Image from 'next/image';
import AiTutor from '@/public/bottom-bar/ai-tutor.webp'
import Home from '@/public/bottom-bar/home.webp'
import Profile1 from '@/public/bottom-bar/profile1.webp'
import Profile2 from '@/public/bottom-bar/profile2.webp'
import Ranking1 from '@/public/bottom-bar/ranking1.webp'
import Ranking2 from '@/public/bottom-bar/ranking2.webp'
import Store1 from '@/public/bottom-bar/store1.webp'
import Store2 from '@/public/bottom-bar/store2.webp'
import Study1 from '@/public/bottom-bar/study1.webp'
import Study2 from '@/public/bottom-bar/study2.webp'
import { motion, AnimatePresence } from 'framer-motion'

export default function Bottom() {
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
      <TranslatedBottom />
    </NextIntlClientProvider>
  );
}

function TranslatedBottom() {
  const t = useTranslations('index');
  const pathname = usePathname();
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState('');
  const [countryCode, setCountryCode] = useState('en')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalMessage, setModalMessage] = useState(null)
  const [type, setType] = useState([])
  const [isTutorFirst, setIsTutorFirst] = useState(false)
  const dispatch = useDispatch()

  const handleYesClick = (buttonLink) => {
    setIsOpenModal(false)
    if (buttonLink === 'ai-tutor') {
      router.push(`/${countryCode}/ai-tutor/${type[0]}/${type[1]}`)
    } else {
      setIsTutorFirst(false)
      goTutorStudy()
    }
  }

  const handleOpenModal = (messageIndex) => {
    setModalMessage(modalMessages[messageIndex])
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    const tutorData = JSON.parse(localStorage.getItem('tutor'))
    if (tutorData.tutorLimit > 0) {
      if (isTutorFirst) {
        setIsOpenModal(false)
        setIsTutorFirst(false)
      } else {
        // dispatch(updateTutorLimit(-1))
        // decrementTutorLimit()
        setIsOpenModal(false)
        dispatch(resetState())
        router.push(`/${countryCode}/ai-tutor`)
      }
    } else {
      setIsOpenModal(false)
    }
  }

  const modalMessages = [
    // 대화종료 메세지
    {
      'message': 'you-have-a-previous-conversation-on-this-topic-would-you-like-to-pick-up-where-you-left-off',
      'background': 'bird',
      'buttonLink': 'ai-tutor',
      'buttonType': 1
    },
    // 스피커 부족 메세지
    {
      'message' : "you-cannot-proceed-with-free-talking-you-don't-have-enough-speakers",
      'background': 'bird',
      'image': 'megaphone',
      'buttonLink': 'ai-tutor',
      'buttonType': 2
    },
    // 스피커 까인다는 메세지
    {
      'message' : "ai-tutor-will-consume-speaker",
      'background': 'bird',
      'image': 'megaphone-down',
      'buttonLink': 'ai-tutor-first',
      'buttonType': 1
    }
  ]

  useEffect(() => {
    const pathArray = pathname.split('/')
    setCurrentPage(pathArray[2]);
    setCountryCode(pathArray[1]);
  }, [pathname]);

  const decrementTutorLimit = () => {
    const tutorData = JSON.parse(localStorage.getItem('tutor'))

    if (tutorData && tutorData.tutorLimit > 0) {
      tutorData.tutorLimit -= 1;
      localStorage.setItem('tutor', JSON.stringify(tutorData));
    }
  }

  const goTutorStudy = () => {
    // dispatch(updateTutorLimit(-1))
    // decrementTutorLimit()
    router.push(`/${countryCode}/ai-tutor`)
  }

  const handleAiTutorLink = (() => {
    const storedData = localStorage.getItem('aiTutorState')
    const tutorData = JSON.parse(localStorage.getItem('tutor'))
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      if (parsedData.type && parsedData.type.length > 0) {
        setType([parsedData.type[0], parsedData.type[1]])
        handleOpenModal(0)
      } else {
        // 만약 튜터 리미트가 남아있다면 스피커 감소한다는 메세지 on
        if (tutorData && tutorData.tutorLimit > 0) {
          setIsTutorFirst(true)
          handleOpenModal(2)
        } else {
          // 안남아있으면 실행 불가능
          handleOpenModal(1)
        }
      }
    } else {
      if (tutorData && tutorData.tutorLimit > 0) {
        setIsTutorFirst(true)
        handleOpenModal(2)
      } else {
        handleOpenModal(1)
      }
    }
  })

  return (
    <div className="fixed bottom-0 left-0 w-full bg-none flex justify-between">
      <div
        className="relative w-[50vw]"
      >
        <div
          className="w-[50vw] h-[10vh] rounded-tr-[10px] bg-[#FFFFFF] pr-[8vw]"
          style={{
            // transform: "skew(30deg) translate(-20px, 0px)",
            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="flex justify-around items-center w-full h-full"
            // style={{transform: "skew(-30deg)"}}
          >
            <Link href={`/${countryCode}/store`} className='w-full h-full flex justify-between items-center'>
                {currentPage === 'store' ? (
                  <div className='flex flex-col items-center justify-center h-full ml-6 md:ml-[10vw]'>
                    <motion.div
                      key="store2"
                      initial={currentPage === 'store' ? { opacity: 0, scale: 0.9 } : {}}
                      animate={currentPage === 'store' ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.8 }}
                      className="flex items-center justify-center w-auto h-2/5 cursor-pointer"
                    >
                      <Image src={Store2} alt="store_link" className="w-auto h-[80%] cursor-pointer transform -translate-y-[10%]" />
                    </motion.div>
                    <div className='text-md md:text-xl lg:text-2xl text-[#3c3c9c]'>
                      {t('store')}
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center h-full ml-6 md:ml-[10vw]'>
                    <motion.div
                      key="store1"
                      initial={currentPage === 'store' ? { opacity: 0, scale: 0.9 } : {}}
                      animate={currentPage === 'store' ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.8 }}
                      className="flex items-center justify-center w-auto h-2/5 cursor-pointer"
                    >
                      <Image src={Store1} alt="store_link" className="w-auto h-[80%] cursor-pointer transform -translate-y-[10%]" />
                    </motion.div>
                    <div className='text-md md:text-xl lg:text-2xl text-[#3c3c9c]'>
                      {t('store')}
                    </div>
                  </div>
                )}
            </Link>
            <Link href={`/${countryCode}/study`} className='w-full h-full flex justify-center items-center'>
                {currentPage === 'study' ? (
                  <div className='flex flex-col justify-center items-center h-full mr-9 md:mr-[7vw]'>
                    <motion.div
                      key="study2"
                      initial={currentPage === 'study' ? { opacity: 0, scale: 0.9 } : {}}
                      animate={currentPage === 'study' ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.8 }}
                      className="w-auto h-2/5 cursor-pointer"  
                    >
                      <Image src={Study2} alt="study_link" className="w-auto h-[80%] cursor-pointer" />
                    </motion.div>
                    <div className='text-md md:text-xl lg:text-2xl text-[#3c3c9c]'>
                      {t('study')}
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col justify-center items-center h-full mr-9 md:mr-[7vw]'>
                    <motion.div
                      key="study1"
                      initial={currentPage === 'study' ? { opacity: 0, scale: 0.9 } : {}}
                      animate={currentPage === 'study' ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.8 }}
                      className="w-auto h-2/5 cursor-pointer"
                    >
                      <Image src={Study1} alt="study_link" className="w-auto h-[80%] cursor-pointer" />
                    </motion.div>
                    <div className='text-md md:text-xl lg:text-2xl text-[#3c3c9c]'>
                    {t('study')}
                    </div>
                  </div>
                )}
            </Link>
          </div>
        </div>
      </div>
      <div
        className="absolute w-[12vh] h-[12vh] bg-[#ffffff] flex items-center justify-center left-1/2 transform -translate-x-1/2 bottom-0 z-10 pb-3 pt-3"
        style={{
          boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: "20vw 20vw 0 0",
         }}
      >
          {currentPage === 'main' ? (
            <div onClick={handleAiTutorLink} className='w-full h-full flex flex-col justify-center items-center'>
                <motion.div
                  key="ai_tutor"
                  className="w-auto h-3/5 cursor-pointer"
                >
                  <Image src={AiTutor} alt="ai_tutor_link" className="w-auto h-[90%] cursor-pointer" />
                </motion.div>
                <div className='text-md md:text-xl lg:text-2xl text-[#3c3c9c]'>
                  {t('ai-tutor')}
                </div>
            </div>
          ) : (
            <Link href={`/${countryCode}/main`} className='w-full h-full flex flex-col justify-center items-center'>
                <motion.div
                  key="home"
                  className="w-auto h-3/5 cursor-pointer"
                >
                  <Image src={Home} alt="Home_link" className="w-auto h-[90%] cursor-pointer" />
                </motion.div>
                <div className='text-xl md:text-2xl lg:text-3xl text-[#3c3c9c]'>
                  {t('home')}
                </div>
            </Link>
          )}
      </div>
      <div className="w-[50vw]">
        <div
          className="w-[50vw] h-[10vh] rounded-tl-[10px] bg-[#FFFFFF] pl-[8vw]"
          style={{
            // transform: "skew(-30deg) translate(20px, 0px)",
            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="flex justify-around items-center w-full h-full"
            // style={{transform: "skew(30deg)"}}
          >
            <Link href={`/${countryCode}/ranking`} className='w-full h-full flex justify-between items-center'>
              {currentPage === 'ranking' ? (
                <div className='flex flex-col justify-center items-center h-full ml-9 md:ml-[10vw]'>
                  <motion.div
                    key="ranking2"
                    initial={currentPage === 'ranking' ? { opacity: 0, scale: 0.9 } : {}}
                    animate={currentPage === 'ranking' ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="w-auto h-2/5 cursor-pointer"
                  >
                    <Image src={Ranking2} alt="ranking_link" className="w-auto h-[80%] cursor-pointer" />
                  </motion.div>
                  <div className='text-md md:text-xl lg:text-2xl text-[#3c3c9c]'>
                    {t('rank')}
                  </div>
                </div>
              ) : (
                <div className='flex flex-col justify-center items-center h-full ml-9 md:ml-[10vw]'>
                  <motion.div
                    key="ranking1"
                    initial={currentPage === 'ranking' ? { opacity: 0, scale: 0.9 } : {}}
                    animate={currentPage === 'ranking' ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="w-auto h-2/5 cursor-pointer"
                  >
                    <Image src={Ranking1} alt="ranking_link" className="w-auto h-[80%] cursor-pointer" />
                  </motion.div>
                  <div className='text-md md:text-xl lg:text-2xl text-[#3c3c9c]'>
                    {t('rank')}
                  </div>
                </div>
              )}
            </Link>
            <Link href={`/${countryCode}/profile`}className='w-full h-full flex justify-end items-center'>
              {currentPage === 'profile' ? (
                <div className='flex flex-col justify-center items-center h-full mr-6 md:mr-[10vw]'>
                  <motion.div
                    key="profile2"
                    initial={currentPage === 'profile' ? { opacity: 0, scale: 0.9 } : {}}
                    animate={currentPage === 'profile' ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="w-auto h-2/5 cursor-pointer"
                  >
                    <Image src={Profile2} alt="profile_link" className="w-auto h-[80%] cursor-pointer" />
                  </motion.div>
                  <div className='text-md md:text-xl lg:text-2xl text-[#3c3c9c]'>
                    {t('profile')}
                  </div>
                </div>
              ) : (
                <div className='flex flex-col justify-center items-center h-full mr-6 md:mr-[10vw]'>
                  <motion.div
                    key="profile1"
                    initial={currentPage === 'profile' ? { opacity: 0, scale: 0.9 } : {}}
                    animate={currentPage === 'profile' ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8 }}
                    className="w-auto h-2/5 cursor-pointer"
                  >
                    <Image src={Profile1} alt="profile_link" className="w-auto h-[80%] cursor-pointer" />
                  </motion.div>
                  <div className='text-md md:text-xl lg:text-2xl text-[#3c3c9c]'>
                    {t('profile')}
                  </div>
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>
      {isOpenModal && 
        <div className='relataive z-1000'>
          <Modal handleYesClick={handleYesClick} handleCloseModal={handleCloseModal} message={modalMessage} />
        </div>
      }
    </div>
  );
}
