'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { resetState } from '@/store/ai-tutor';
import Modal from '@/components/modal/modal'
import Link from 'next/link';
import Image from 'next/image'
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
  const dispatch = useDispatch()

  const handleYesClick = (buttonLink) => {
    setIsOpenModal(false)
    if (buttonLink === 'ai-tutor') {
    }
    router.push(`/${countryCode}/ai-tutor/${type[0]}/${type[1]}`)
  }

  const handleOpenModal = (messageIndex) => {
    setModalMessage(modalMessages[messageIndex])
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
    dispatch(resetState())
    router.push(`/${countryCode}/ai-tutor`)
  }

  const modalMessages = [
    // 대화종료 메세지
    {
      'message': 'you-have-a-previous-conversation-on-this-topic-would-you-like-to-pick-up-where-you-left-off',
      'background': 'bird',
      'buttonLink': 'ai-tutor',
      'buttonType': 1
    },
  ]

  useEffect(() => {
    const pathArray = pathname.split('/')
    setCurrentPage(pathArray[2]);
    setCountryCode(pathArray[1]);
  }, [pathname]);

  const handleAiTutorLink = (() => {
    const storedData = localStorage.getItem('aiTutorState')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      if (parsedData.type && parsedData.type.length > 0) {
        setType([parsedData.type[0], parsedData.type[1]])
        handleOpenModal(0)
      }
    } else {
      router.push(`/${countryCode}/ai-tutor`)
    }
  })

  return (
    <div className="fixed bottom-0 left-0 w-full bg-none flex justify-between">
      <div
        className="relative w-[50vw]"
      >
        <div
          className="w-[50vw] h-[10vh] rounded-tr-[10px] bg-[#E4FEFF]"
          style={{
            transform: "skew(30deg) translate(-20px, 0px)",
            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="flex justify-around items-center w-full h-full"
            style={{transform: "skew(-30deg)"}}
          >
            <Link href={`/${countryCode}/store`} className='w-full h-full flex justify-center items-center'>
              <AnimatePresence>
                {currentPage === 'store' ? (
                  <div className='ml-6'>
                    <motion.div
                      key="store2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      className="w-auto h-2/5 cursor-pointer"
                    >
                      <Image src={Store2} alt="store_link" className="w-auto h-full cursor-pointer" />
                    </motion.div>
                  </div>
                ) : (
                  <div className='ml-6'>
                    <motion.div
                      key="store1"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      className="w-auto h-2/5 cursor-pointer"
                    >
                      <Image src={Store1} alt="store_link" className="w-auto h-full cursor-pointer" />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </Link>
            <Link href={`/${countryCode}/study`} className='w-full h-full flex justify-center items-center'>
              <AnimatePresence>
                {currentPage === 'study' ? (
                  <div className='mr-9'>
                    <motion.div
                      key="study2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      className="w-auto h-2/5 cursor-pointer"  
                    >
                      <Image src={Study2} alt="study_link" className="w-auto h-full cursor-pointer" />
                    </motion.div>
                  </div>
                ) : (
                  <div className='mr-9'>
                    <motion.div
                      key="study1"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      className="w-auto h-2/5 cursor-pointer"
                    >
                      <Image src={Study1} alt="study_link" className="w-auto h-full cursor-pointer" />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="absolute w-[12vh] h-[12vh] bg-[#E4FEFF] rounded-full flex items-center justify-center left-1/2 transform -translate-x-1/2 bottom-0 z-10"
        style={{ boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.25)" }}
      >
          {currentPage === 'main' ? (
            <div onClick={handleAiTutorLink} className='w-full h-full flex justify-center items-center'>
              <AnimatePresence>
                <motion.div
                  key="ai_tutor"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                  className="w-auto h-3/5 cursor-pointer"
                >
                  <Image src={AiTutor} alt="ai_tutor_link" className="w-auto h-full cursor-pointer" />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <Link href={`/${countryCode}/main`} className='w-full h-full flex justify-center items-center'>
              <AnimatePresence>
                <motion.div
                  key="home"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                  className="w-auto h-3/5 cursor-pointer"
                >
                  <Image src={Home} alt="Home_link" className="w-auto h-full cursor-pointer" />
                </motion.div>
              </AnimatePresence>
            </Link>
          )}
      </div>
      <div className="w-[50vw]">
        <div
          className="w-[50vw] h-[10vh] rounded-tl-[10px] bg-[#E4FEFF]"
          style={{
            transform: "skew(-30deg) translate(20px, 0px)",
            boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            className="flex justify-around items-center w-full h-full"
            style={{transform: "skew(30deg)"}}
          >
            <Link href={`/${countryCode}/ranking/all`} className='w-full h-full flex justify-center items-center'>
            <AnimatePresence>
              {currentPage === 'ranking' ? (
                <div className='ml-9'>
                  <motion.div
                    key="ranking2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    className="w-auto h-2/5 cursor-pointer"
                  >
                    <Image src={Ranking2} alt="ranking_link" className="w-auto h-full cursor-pointer" />
                  </motion.div>
                </div>
              ) : (
                <div className='ml-9'>
                  <motion.div
                    key="ranking1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    className="w-auto h-2/5 cursor-pointer"
                  >
                    <Image src={Ranking1} alt="ranking_link" className="w-auto h-full cursor-pointer" />
                  </motion.div>
                </div>
              )}
              </AnimatePresence>
            </Link>
            <Link href={`/${countryCode}/profile`}className='w-full h-full flex justify-center items-center'>
            <AnimatePresence>
              {currentPage === 'profile' ? (
                <div className='mr-6'>
                  <motion.div
                    key="profile2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    className="w-auto h-2/5 cursor-pointer"
                  >
                    <Image src={Profile2} alt="profile_link" className="w-auto h-full cursor-pointer" />
                  </motion.div>
                </div>
              ) : (
                <div className='mr-6'>
                  <motion.div
                    key="profile1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    className="w-auto h-2/5 cursor-pointer"
                  >
                    <Image src={Profile1} alt="profile_link" className="w-auto h-full cursor-pointer" />
                  </motion.div>
                </div>
              )}
                </AnimatePresence>
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
